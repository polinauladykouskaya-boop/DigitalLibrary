import { getFromStorage, saveToStorage } from '../utils/storage.js';
import { createElement, clearElement } from '../utils/dom.js';

const STORAGE_KEY = 'library_news';

export function initNews() {
  const newsContainer = document.getElementById('news-list-container');
  const addNewsBtn = document.getElementById('add-news-btn');
  const modal = document.getElementById('modal-container');
  const modalSlot = document.getElementById('modal-form-slot');
  const template = document.getElementById('news-form-template');

  if (!newsContainer || !addNewsBtn) return;

  function renderNews(filter = '') {
    const news = getFromStorage(STORAGE_KEY, []);
    clearElement(newsContainer);

    const filteredNews = news.filter(item => 
      item.title.toLowerCase().includes(filter.toLowerCase()) || 
      item.text.toLowerCase().includes(filter.toLowerCase())
    );

    if (filteredNews.length === 0) {
      newsContainer.innerHTML = '<p class="section__text">Новостей пока нет.</p>';
      return;
    }

    filteredNews.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(item => {
      const card = createElement('article', ['news-card']);
      card.innerHTML = `
        <h3 class="news-card__title">${item.title}</h3>
        <time class="news-card__date">${new Date(item.date).toLocaleDateString('ru-RU')}</time>
        <p class="news-card__text">${item.text}</p>
        <div class="news-card__actions">
          <button class="button button--small button--primary btn-edit" data-id="${item.id}">Редактировать</button>
          <button class="button button--small btn-delete" data-id="${item.id}" style="background: #dc3545; color: white;">Удалить</button>
        </div>
      `;

      card.querySelector('.btn-edit').onclick = () => openNewsModal(item);
      card.querySelector('.btn-delete').onclick = () => deleteNews(item.id);

      newsContainer.appendChild(card);
    });
  }

  function openNewsModal(editItem = null) {
    clearElement(modalSlot);
    const formContent = template.content.cloneNode(true);
    modalSlot.appendChild(formContent);

    const form = document.getElementById('news-form');
    const titleInput = document.getElementById('news-title');
    const dateInput = document.getElementById('news-date');
    const textInput = document.getElementById('news-text');
    const idInput = document.getElementById('news-edit-id');

    if (editItem) {
      titleInput.value = editItem.title;
      dateInput.value = editItem.date;
      textInput.value = editItem.text;
      idInput.value = editItem.id;
    } else {
      dateInput.value = new Date().toISOString().split('T')[0];
    }

    form.onsubmit = (e) => {
      e.preventDefault();
      const news = getFromStorage(STORAGE_KEY, []);
      const newsData = {
        id: idInput.value || Date.now().toString(),
        title: titleInput.value,
        date: dateInput.value,
        text: textInput.value
      };

      if (idInput.value) {
        const index = news.findIndex(n => n.id === idInput.value);
        news[index] = newsData;
      } else {
        news.push(newsData);
      }

      saveToStorage(STORAGE_KEY, news);
      modal.classList.remove('modal--active');
      renderNews();
    };

    modal.classList.add('modal--active');
  }

  function deleteNews(id) {
    if (confirm('Удалить эту новость?')) {
      const news = getFromStorage(STORAGE_KEY, []).filter(n => n.id !== id);
      saveToStorage(STORAGE_KEY, news);
      renderNews();
    }
  }

  addNewsBtn.onclick = () => openNewsModal();

  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const activePage = document.querySelector('.page-section[style*="display: block"]');
      if (activePage && activePage.id === 'home-page') {
        renderNews(e.target.value);
      }
    });
  }

  renderNews();
}