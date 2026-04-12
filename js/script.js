import BookHandler from './components/BookDataHandler.js';
import Storage from './storage/localStorage.js';
import APITester from './utils/tester.js'; 

class DigitalLibraryApp {
    constructor() {
        this.container = document.getElementById('catalog-list-container');
        this.searchInput = document.getElementById('search-input');
        this.favoritesContainer = document.getElementById('favorites-sidebar-container');
        
        this.init();
    }

    async init() {
        this.setupNavigation();
        this.setupSearch();
        this.renderFavorites(); 
        Storage.clearExpired();

        if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
            console.log('--- Режим разработки: Запуск тестов ---');
            await APITester.testAPIConnection();
            APITester.testStorageFunctionality();
            APITester.testOfflineMock();
        }
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav__link');
        const pages = document.querySelectorAll('.page-section');
        const burger = document.getElementById('burger');
        const nav = document.getElementById('nav');

        window.showPage = (pageId) => {
            pages.forEach(page => page.style.display = 'none');
            const activePage = document.getElementById(pageId);
            if (activePage) {
                activePage.style.display = 'block';
            }
            nav?.classList.remove('nav--active');
        };

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.dataset.page;
                if (target === 'home' || target === 'news-page') showPage('home-page');
                else if (target === 'catalog') showPage('catalog-page');
            });
        });

        burger?.addEventListener('click', () => nav.classList.toggle('nav--active'));
        showPage('home-page');
    }

    setupSearch() {
        let timeout = null;
        this.searchInput?.addEventListener('input', (e) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => this.handleSearch(e.target.value), 600);
        });
    }

    async handleSearch(query) {
        if (query.length < 3) return;
        window.showPage('catalog-page');

        const cacheKey = `search_cache_${query.toLowerCase()}`;
        const cachedData = Storage.get(cacheKey, null, 3600000);

        if (cachedData) {
            this.updateUI(cachedData, 'из кэша');
            return;
        }

        try {
            const books = await BookHandler.getBooks(query);
            Storage.set(cacheKey, books);
            this.updateUI(books, 'с сервера');
        } catch (error) {
            this.showError(error.message);
        }
    }

    updateUI(books, source) {
        console.log(`Данные загружены ${source}`);
        BookHandler.renderBooks(books, this.container, (book) => this.addToFavorites(book));
    }
    

    addToFavorites(book) {
        const favorites = Storage.get('favorites', []);
        if (!favorites.find(f => f.id === book.id)) {
            favorites.push(book);
            Storage.set('favorites', favorites);
            this.renderFavorites(); 
        } else {
            alert(`Книга "${book.title}" уже в избранном`);
        }
    }

    // НОВЫЙ МЕТОД: Удаление из избранного
    removeFromFavorites(bookId) {
        let favorites = Storage.get('favorites', []);
        favorites = favorites.filter(f => f.id !== bookId);
        Storage.set('favorites', favorites);
        this.renderFavorites();
    }

    renderFavorites() {
        if (!this.favoritesContainer) return;
        const favorites = Storage.get('favorites', []);
        
        if (favorites.length === 0) {
            this.favoritesContainer.innerHTML = '<p class="sidebar__text">Избранное пусто</p>';
            return;
        }

        this.favoritesContainer.innerHTML = `
            <h3 class="sidebar__title">Избранное (${favorites.length})</h3>
            <div class="favorites-list">
                ${favorites.map(book => `
                    <div style="margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
                        <div style="font-weight: bold; font-size: 0.9em;">${book.title}</div>
                        <button class="btn-remove" data-id="${book.id}" style="color: red; background: none; border: none; cursor: pointer; padding: 0; font-size: 0.8em;">Удалить</button>
                    </div>
                `).join('')}
            </div>
        `;

        // Вешаем события на кнопки удаления
        this.favoritesContainer.querySelectorAll('.btn-remove').forEach(btn => {
            btn.addEventListener('click', () => this.removeFromFavorites(btn.dataset.id));
        });
    }

    showError(msg) {
        if (this.container) {
            this.container.innerHTML = `<p class="error">${msg}</p>`;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => new DigitalLibraryApp());

