import { getFromStorage, saveToStorage } from '../utils/storage.js';
import { createElement, clearElement } from '../utils/dom.js';

const STORAGE_KEY = 'library_favorites';
const ITEMS_KEY = 'library_items';

export function initFavorites() {
  const sidebarContainer = document.getElementById('favorites-sidebar-container');

  function updateFavoritesWidget() {
    if (!sidebarContainer) return;
    
    const favorites = getFromStorage(STORAGE_KEY, []);
    const allItems = getFromStorage(ITEMS_KEY, []);
    
    clearElement(sidebarContainer);

    const widget = createElement('div', ['favorites-widget']);
    widget.innerHTML = `<h3 class="favorites-widget__title">Избранное</h3>`;
    
    const list = createElement('ul', ['favorites-widget__list']);

    if (favorites.length === 0) {
      const emptyMsg = createElement('li', ['favorites-widget__empty']);
      emptyMsg.textContent = 'Список пуст';
      list.appendChild(emptyMsg);
    } else {
      favorites.forEach(id => {
        const item = allItems.find(i => i.id === id);
        if (item) {
          const li = createElement('li', ['favorites-widget__item']);
          li.innerHTML = `
            <div class="favorites-widget__info">
              <span class="favorites-widget__book-title" data-id="${item.id}">${item.name}</span>
            </div>
            <button class="favorites-widget__remove" data-id="${item.id}">&times;</button>
          `;
          
          li.querySelector('.favorites-widget__book-title').onclick = () => {
            window.showPage('details-page', item.id);
          };
          
          li.querySelector('.favorites-widget__remove').onclick = () => {
            toggleFavorite(item.id);
          };
          
          list.appendChild(li);
        }
      });
    }

    widget.appendChild(list);
    sidebarContainer.appendChild(widget);
    updateButtonsState();
  }

  function toggleFavorite(itemId) {
    let favorites = getFromStorage(STORAGE_KEY, []);
    const index = favorites.indexOf(itemId);

    if (index === -1) {
      favorites.push(itemId);
    } else {
      favorites.splice(index, 1);
    }

    saveToStorage(STORAGE_KEY, favorites);
    updateFavoritesWidget();
  }

  function updateButtonsState() {
    const favorites = getFromStorage(STORAGE_KEY, []);
    const buttons = document.querySelectorAll('.button--favorite');

    buttons.forEach(btn => {
      const id = btn.dataset.bookId;
      const btnText = btn.querySelector('.btn-text');
      
      if (favorites.includes(id)) {
        btn.classList.add('active');
        if (btnText) btnText.textContent = 'В избранном';
      } else {
        btn.classList.remove('active');
        if (btnText) btnText.textContent = 'В избранное';
      }

      btn.onclick = (e) => {
        e.stopPropagation();
        toggleFavorite(id);
      };
    });
  }

  window.addEventListener('catalogRendered', updateButtonsState);
  window.addEventListener('detailsRendered', updateButtonsState);
  
  updateFavoritesWidget();
}