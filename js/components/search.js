import { createElement, clearElement } from '../utils/dom.js';

const booksDatabase = [
  { id: 'war-and-peace', title: 'Война и мир', author: 'Лев Толстой' },
  { id: 'anna-karenina', title: 'Анна Каренина', author: 'Лев Толстой' },
  { id: 'quiet-don', title: 'Тихий Дон', author: 'Михаил Шолохов' },
  { id: 'crime-punishment', title: 'Преступление и наказание', author: 'Фёдор Достоевский' },
  { id: 'master-margarita', title: 'Мастер и Маргарита', author: 'Михаил Булгаков' },
];

export function initSearch() {
  const searchInput = document.getElementById('search-input');
  const suggestionsContainer = document.getElementById('search-suggestions');
  
  if (!searchInput || !suggestionsContainer) {
    console.warn('Элементы поиска не найдены');
    return;
  }

  function searchBooks(query) {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return booksDatabase.filter(book => 
      book.title.toLowerCase().includes(lowerQuery) || 
      book.author.toLowerCase().includes(lowerQuery)
    );
  }

  function showSuggestions(books) {
    clearElement(suggestionsContainer);
    
    if (books.length === 0) {
      suggestionsContainer.classList.remove('search-widget__suggestions--active');
      return;
    }

    books.forEach(book => {
      const suggestion = createElement('div', ['search-widget__suggestion'], {
        'data-book-id': book.id
      });
      suggestion.innerHTML = `<strong>${book.title}</strong> — ${book.author}`;
      suggestion.addEventListener('click', () => {
        searchInput.value = book.title;
        suggestionsContainer.classList.remove('search-widget__suggestions--active');
        alert(`Вы выбрали книгу: "${book.title}"`);
      });
      suggestionsContainer.appendChild(suggestion);
    });
    
    suggestionsContainer.classList.add('search-widget__suggestions--active');
  }

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value;
    const results = searchBooks(query);
    showSuggestions(results);
  });
  
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
      suggestionsContainer.classList.remove('search-widget__suggestions--active');
    }
  });
}