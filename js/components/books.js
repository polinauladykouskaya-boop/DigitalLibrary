import { getFromStorage, saveToStorage } from '../utils/storage.js';
import { createElement, clearElement } from '../utils/dom.js';

const STORAGE_KEY = 'library_items';

export function initBooks() {
  const catalogContainer = document.getElementById('catalog-list-container');
  const addItemBtn = document.getElementById('add-item-btn');
  const sortSelect = document.getElementById('catalog-sort');
  const modal = document.getElementById('modal-container');
  const modalSlot = document.getElementById('modal-form-slot');
  const template = document.getElementById('item-form-template');
  const searchInput = document.getElementById('search-input');
  const suggestionsBox = document.getElementById('search-suggestions');

  if (!catalogContainer || !addItemBtn) return;

  function renderCatalog(filterText = '') {
    let items = getFromStorage(STORAGE_KEY, []);
    const sortValue = sortSelect.value;

    if (filterText) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(filterText.toLowerCase())
      );
    }

    items.sort((a, b) => {
      if (sortValue === 'date-desc') return new Date(b.date) - new Date(a.date);
      if (sortValue === 'date-asc') return new Date(a.date) - new Date(b.date);
      if (sortValue === 'name-asc') return a.name.localeCompare(b.name);
      if (sortValue === 'name-desc') return b.name.localeCompare(a.name);
      return 0;
    });

    clearElement(catalogContainer);

    if (items.length === 0) {
      catalogContainer.innerHTML = '<p class="section__text">Ничего не найдено.</p>';
      return;
    }

    items.forEach(item => {
      const article = createElement('article', ['book-preview']);
      const imageFile = item.image ? item.image : 'logo.png';
      
      article.innerHTML = `
        <h3 class="book-preview__title" data-id="${item.id}">${item.name}</h3>
        <p class="book-preview__date">Дата: ${new Date(item.date).toLocaleDateString('ru-RU')}</p>
        <img class="book-preview__image" src="images/${imageFile}" alt="${item.name}" onerror="this.src='images/logo.png'">
        <div class="news-card__actions" style="margin-top: auto; padding-top: 10px;">
          <button class="button button--small button--primary btn-edit" data-id="${item.id}">Ред.</button>
          <button class="button button--small btn-delete" data-id="${item.id}" style="background: #dc3545; color: white;">Удалить</button>
        </div>
        <button class="button button--favorite button--small" data-book-id="${item.id}" style="margin-top: 10px;">
          <span class="favorite-icon">&hearts;</span> <span class="btn-text">В избранное</span>
        </button>
      `;

      article.querySelector('.book-preview__title').onclick = () => window.showPage('details-page', item.id);
      article.querySelector('.btn-edit').onclick = (e) => { e.stopPropagation(); openItemModal(item); };
      article.querySelector('.btn-delete').onclick = (e) => { e.stopPropagation(); deleteItem(item.id); };

      catalogContainer.appendChild(article);
    });

    window.dispatchEvent(new CustomEvent('catalogRendered'));
  }

  function handleAutocomplete(query) {
    if (!query) {
      suggestionsBox.style.display = 'none';
      return;
    }

    const items = getFromStorage(STORAGE_KEY, []);
    const matches = items.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);

    if (matches.length > 0) {
      clearElement(suggestionsBox);
      matches.forEach(match => {
        const div = createElement('div', ['suggestion-item']);
        div.style.padding = '10px';
        div.style.cursor = 'pointer';
        div.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
        div.style.color = 'white';
        div.textContent = match.name;
        
        div.onclick = () => {
          searchInput.value = match.name;
          suggestionsBox.style.display = 'none';
          window.showPage('details-page', match.id);
        };
        
        suggestionsBox.appendChild(div);
      });
      suggestionsBox.style.display = 'block';
    } else {
      suggestionsBox.style.display = 'none';
    }
  }

  function openItemModal(editItem = null) {
    clearElement(modalSlot);
    const formContent = template.content.cloneNode(true);
    modalSlot.appendChild(formContent);
    const form = document.getElementById('item-form');
    
    const imgGroup = createElement('div', ['form-group']);
    imgGroup.innerHTML = `
      <label for="item-image" class="form-label">Имя файла картинки:</label>
      <input type="text" id="item-image" class="form-input" placeholder="Например: book1.png">
    `;
    form.insertBefore(imgGroup, form.querySelector('button'));

    if (editItem) {
      document.getElementById('item-name').value = editItem.name;
      document.getElementById('item-date').value = editItem.date;
      document.getElementById('item-description').value = editItem.description;
      document.getElementById('item-edit-id').value = editItem.id;
      document.getElementById('item-image').value = editItem.image || '';
    } else {
      document.getElementById('item-date').value = new Date().toISOString().split('T')[0];
    }

    form.onsubmit = (e) => {
      e.preventDefault();
      const items = getFromStorage(STORAGE_KEY, []);
      const id = document.getElementById('item-edit-id').value || Date.now().toString();
      const itemData = {
        id,
        name: document.getElementById('item-name').value,
        date: document.getElementById('item-date').value,
        description: document.getElementById('item-description').value,
        image: document.getElementById('item-image').value
      };
      const index = items.findIndex(i => i.id === id);
      if (index !== -1) items[index] = itemData;
      else items.push(itemData);
      saveToStorage(STORAGE_KEY, items);
      modal.classList.remove('modal--active');
      renderCatalog();
    };
    modal.classList.add('modal--active');
  }

  function deleteItem(id) {
    if (confirm('Удалить книгу?')) {
      const items = getFromStorage(STORAGE_KEY, []).filter(i => i.id !== id);
      saveToStorage(STORAGE_KEY, items);
      renderCatalog();
    }
  }

  searchInput.addEventListener('input', (e) => {
    handleAutocomplete(e.target.value);
    const activePage = document.querySelector('.page-section[style*="display: block"]');
    if (activePage && activePage.id === 'catalog-page') {
      renderCatalog(e.target.value);
    }
  });

  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
      suggestionsBox.style.display = 'none';
    }
  });

  addItemBtn.onclick = () => openItemModal();
  sortSelect.onchange = () => renderCatalog();
  renderCatalog();
}