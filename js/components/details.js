import { getFromStorage, saveToStorage } from '../utils/storage.js';
import { createElement, clearElement } from '../utils/dom.js';
import { initReviews } from './reviews.js';

const STORAGE_KEY = 'library_items';

export function renderItemDetails(itemId) {
  const container = document.getElementById('item-details-container');
  if (!container) return;

  const items = getFromStorage(STORAGE_KEY, []);
  const item = items.find(i => i.id === itemId);

  if (!item) {
    container.innerHTML = '<p class="section__text">Элемент не найден.</p>';
    return;
  }

  clearElement(container);

  const mainImage = item.image ? `images/${item.image}` : 'images/logo.png';
  
  const article = createElement('article', ['book-card']);
  article.innerHTML = `
    <header class="book-card__header">
      <h2 class="book-card__title">${item.name}</h2>
    </header>
    
    <figure class="figure">
      <img class="figure__image" src="${mainImage}" alt="${item.name}" onerror="this.src='images/logo.png'">
      <figcaption class="figure__caption">Дата добавления: ${new Date(item.date).toLocaleDateString('ru-RU')}</figcaption>
    </figure>
    
    <section class="section">
      <h3 class="section__title">Описание</h3>
      <p class="section__text">${item.description}</p>
    </section>

    ${item.id === 'war-and-peace' ? `
      <section class="gallery">
        <h3 class="section__title">Галерея</h3>
        <div class="gallery__grid">
          <figure class="figure">
            <img class="figure__image" src="images/book1-back.png" alt="Задняя сторона">
            <figcaption class="figure__caption">Задняя сторона</figcaption>
          </figure>
          <figure class="figure">
            <img class="figure__image" src="images/book1-inside.png" alt="Разворот">
            <figcaption class="figure__caption">Разворот</figcaption>
          </figure>
        </div>
      </section>
    ` : ''}

    <div class="favorite-button-container" style="margin-bottom: 30px;">
      <button class="button button--favorite" data-book-id="${item.id}">
        <span class="favorite-icon">&hearts;</span> <span class="btn-text">В избранное</span>
      </button>
    </div>

    <section class="reviews-section">
      <h2 class="reviews-section__title">Отзывы</h2>
      <div class="reviews-section__rating">
        <span class="rating-label">Средняя оценка:</span>
        <div class="rating-stars" id="average-rating-stars">&star;&star;&star;&star;&star;</div>
        <span class="rating-value" id="average-rating-value">0.0</span>
      </div>
      <div class="reviews-list" id="reviews-list"></div>
      <section class="reviews-form">
        <h3 class="reviews-form__title">Добавить отзыв</h3>
        <form id="review-form">
          <div class="form-group">
            <label for="review-name" class="form-label">Ваше имя:</label>
            <input type="text" id="review-name" class="form-input" required minlength="2">
          </div>
          <fieldset class="form-group">
            <legend class="form-label">Оценка:</legend>
            <div class="rating-input" id="rating-input">
              <span class="star" data-rating="1" role="button" tabindex="0">&starf;</span>
              <span class="star" data-rating="2" role="button" tabindex="0">&starf;</span>
              <span class="star" data-rating="3" role="button" tabindex="0">&starf;</span>
              <span class="star" data-rating="4" role="button" tabindex="0">&starf;</span>
              <span class="star" data-rating="5" role="button" tabindex="0">&starf;</span>
            </div>
            <input type="hidden" id="review-rating" value="0">
          </fieldset>
          <div class="form-group">
            <label for="review-text" class="form-label">Ваш отзыв:</label>
            <textarea id="review-text" class="form-textarea" rows="3" required minlength="10"></textarea>
          </div>
          <button type="submit" class="button button--primary">Оставить отзыв</button>
        </form>
      </section>
    </section>
  `;

  container.appendChild(article);
  initReviews(item.id);
  window.dispatchEvent(new CustomEvent('detailsRendered', { detail: { itemId: item.id } }));
}