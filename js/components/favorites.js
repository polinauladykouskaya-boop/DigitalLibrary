import { getFromStorage, saveToStorage } from '../utils/storage.js';

const STORAGE_KEY = 'favorite_books';

export function initFavorites() {
  function loadFavorites() {
    const favorites = getFromStorage(STORAGE_KEY, []);
    updateFavoriteButtons(favorites);
    updateSidebarFavorites(favorites);
  }
  
function updateFavoriteButtons(favorites) {
  const favoriteButtons = document.querySelectorAll('[data-book-id]');
  
  favoriteButtons.forEach(button => {
    const bookId = button.dataset.bookId;
    const isFavorite = favorites.includes(bookId);

    button.classList.toggle('active', isFavorite);

    const icon = button.querySelector('.favorite-icon');
    if (icon) {
      icon.textContent = isFavorite ? '♥️' : '♥️';
    }
  });
}
  
  function updateSidebarFavorites(favorites) {
    let favoritesWidget = document.querySelector('.favorites-widget');
    
    if (!favoritesWidget) {
      const container = document.querySelector('.user-panel__container');
      if (container) {
        favoritesWidget = document.createElement('aside');
        favoritesWidget.className = 'favorites-widget';
        container.appendChild(favoritesWidget);
      }
    }
    
    if (favoritesWidget) {
      if (favorites.length === 0) {
        favoritesWidget.innerHTML = `
          <h3 class="favorites-widget__title">Избранное</h3>
          <p class="favorites-widget__empty">Нет избранных книг</p>
        `;
        return;
      }
      
      const booksDatabase = {
        'war-and-peace': { title: 'Война и мир', author: 'Лев Толстой' },
        'anna-karenina': { title: 'Анна Каренина', author: 'Лев Толстой' },
        'quiet-don': { title: 'Тихий Дон', author: 'Михаил Шолохов' },
        'crime-punishment': { title: 'Преступление и наказание', author: 'Фёдор Достоевский' },
        'master-margarita': { title: 'Мастер и Маргарита', author: 'Михаил Булгаков' },
      };
      
      const favoritesList = favorites.map(id => ({ id, ...booksDatabase[id] })).filter(book => book.title);
      
      favoritesWidget.innerHTML = `
        <h3 class="favorites-widget__title">Избранное (${favorites.length})</h3>
        <ul class="favorites-widget__list">
          ${favoritesList.map(book => `
            <li class="favorites-widget__item" data-book-id="${book.id}">
              <div class="favorites-widget__info">
                <span class="favorites-widget__book-title">${book.title}</span>
                <span class="favorites-widget__book-author">${book.author}</span>
              </div>
              <button class="favorites-widget__remove" data-book-id="${book.id}">&times;</button>
            </li>
          `).join('')}
        </ul>
      `;
      
      const removeButtons = favoritesWidget.querySelectorAll('.favorites-widget__remove');
      removeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          e.stopPropagation();
          const bookId = button.dataset.bookId;
          toggleFavorite(bookId);
        });
      });
    }
  }
  
  function toggleFavorite(bookId) {
    let favorites = getFromStorage(STORAGE_KEY, []);
    
    if (favorites.includes(bookId)) {
      favorites = favorites.filter(id => id !== bookId);
      saveToStorage(STORAGE_KEY, favorites);
      alert('Книга удалена из избранного');
    } else {
      favorites.push(bookId);
      saveToStorage(STORAGE_KEY, favorites);
      alert('Книга добавлена в избранное');
    }
    
    updateFavoriteButtons(favorites);
    updateSidebarFavorites(favorites);
  }
  
  function attachEventListeners() {
    const favoriteButtons = document.querySelectorAll('[data-book-id]');
    favoriteButtons.forEach(button => {
      button.removeEventListener('click', handleFavoriteClick);
      button.addEventListener('click', handleFavoriteClick);
    });
  }
  
  function handleFavoriteClick(e) {
    const button = e.currentTarget;
    if (!button.closest('.favorites-widget__remove')) {
      const bookId = button.dataset.bookId;
      if (bookId) {
        toggleFavorite(bookId);
      }
    }
  }
  
  loadFavorites();
  attachEventListeners();
  
}