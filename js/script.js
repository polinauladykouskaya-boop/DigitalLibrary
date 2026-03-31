import { initSearch } from './components/search.js';
import { initReviews } from './components/reviews.js';
import { initFavorites } from './components/favorites.js';
import { initNews } from './components/news.js';
import { initBooks } from './components/books.js';

window.showPage = function(pageId) {
  document.querySelectorAll('section').forEach(section => {
    section.style.display = 'none';
  });

  document.getElementById(pageId).style.display = 'block';
};

document.addEventListener('DOMContentLoaded', () => {
  initSearch();
  initReviews();
  initFavorites();
  initNews();
  initBooks();
});