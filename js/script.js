import { initSearch } from './components/search.js';
import { initReviews } from './components/reviews.js';
import { initFavorites } from './components/favorites.js';

document.addEventListener('DOMContentLoaded', function() {
  try {
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');
    
    if (burger && nav) {
      burger.addEventListener('click', function() {
        nav.classList.toggle('nav--active');
        console.log('Бургер-меню переключено');
      });
    } else {
      console.warn('Элементы бургер-меню не найдены');
    }
    
    console.log('Запуск инициализации компонентов...');
    
    initSearch();
    initReviews();
    initFavorites();
    
    console.log('Все компоненты успешно инициализированы');
    
  } catch (error) {
    console.error('Ошибка при инициализации приложения:', error);
  }
});
