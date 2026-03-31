import { initNews } from './components/news.js';
import { initBooks } from './components/books.js';
import { initFavorites } from './components/favorites.js';
import { renderItemDetails } from './components/details.js';
import { getFromStorage, saveToStorage } from './utils/storage.js';

const STORAGE_KEY = 'library_items';

const INITIAL_DATA = [
  {
    id: 'war-and-peace',
    name: 'Война и мир',
    date: '1869-01-01',
    description: 'Роман-эпопея Льва Николаевича Толстого, описывающий русское общество в эпоху войн против Наполеона.',
    image: 'book1.png'
  },
  {
    id: 'anna-karenina',
    name: 'Анна Каренина',
    date: '1877-01-01',
    description: 'Сложный психологический роман о жизни и трагедии женщины в высшем обществе.',
    image: 'book2.png'
  },
  {
    id: 'quiet-don',
    name: 'Тихий Дон',
    date: '1928-01-01',
    description: 'Масштабное произведение Михаила Шолохова о судьбе казачества в годы Первой мировой и Гражданской войны.',
    image: 'book3.png'
  }
];

function initApp() {
  if (getFromStorage(STORAGE_KEY, []).length === 0) {
    saveToStorage(STORAGE_KEY, INITIAL_DATA);
  }

  const navLinks = document.querySelectorAll('.nav__link');
  const pages = document.querySelectorAll('.page-section');
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  const modal = document.getElementById('modal-container');
  const modalClose = document.getElementById('modal-close');

  window.showPage = (pageId, itemId = null) => {
    pages.forEach(page => {
      page.style.display = 'none';
    });

    const activePage = document.getElementById(pageId);
    if (activePage) {
      activePage.style.display = 'block';
      window.scrollTo(0, 0);
    }

    if (pageId === 'details-page' && itemId) {
      renderItemDetails(itemId);
    }

    if (pageId === 'home-page') initNews();
    if (pageId === 'catalog-page') initBooks();
    
    nav.classList.remove('nav--active');
  };

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetPage = link.dataset.page;
      if (targetPage === 'home') showPage('home-page');
      else if (targetPage === 'catalog') showPage('catalog-page');
      else if (targetPage === 'news-page') showPage('home-page');
    });
  });

  burger.addEventListener('click', () => {
    nav.classList.toggle('nav--active');
  });

  modalClose.addEventListener('click', () => {
    modal.classList.remove('modal--active');
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('modal--active');
    }
  });

  initNews();
  initBooks();
  initFavorites();
  
  showPage('home-page');
}

document.addEventListener('DOMContentLoaded', initApp);