import { getFromStorage, saveToStorage } from '../utils/storage.js';
import { createElement, clearElement } from '../utils/dom.js';

export function initReviews(itemId) {
  const reviewsList = document.getElementById('reviews-list');
  const reviewForm = document.getElementById('review-form');
  const ratingInput = document.getElementById('rating-input');
  const ratingValueInput = document.getElementById('review-rating');
  const stars = ratingInput.querySelectorAll('.star');
  
  const STORAGE_KEY = `reviews_${itemId}`;

  function updateAverageRating(reviews) {
    const avgStars = document.getElementById('average-rating-stars');
    const avgValue = document.getElementById('average-rating-value');
    
    if (reviews.length === 0) {
      avgStars.innerHTML = '&star;&star;&star;&star;&star;';
      avgValue.textContent = '0.0';
      return;
    }

    const sum = reviews.reduce((acc, rev) => acc + parseInt(rev.rating), 0);
    const average = (sum / reviews.length).toFixed(1);
    
    avgValue.textContent = average;
    
    const fullStars = Math.round(average);
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
      starsHtml += i <= fullStars ? '&starf;' : '&star;';
    }
    avgStars.innerHTML = starsHtml;
  }

  function renderReviews() {
    const reviews = getFromStorage(STORAGE_KEY, []);
    clearElement(reviewsList);

    reviews.sort((a, b) => b.id - a.id).forEach(review => {
      const reviewElement = createElement('div', ['review-item']);
      reviewElement.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
      reviewElement.style.padding = '15px 0';
      
      let starsHtml = '';
      for (let i = 1; i <= 5; i++) {
        starsHtml += i <= review.rating ? '&starf;' : '&star;';
      }

      reviewElement.innerHTML = `
        <div class="review-item__header" style="display:flex; justify-content:space-between; align-items: center;">
          <div>
            <strong>${review.name}</strong>
            <span style="color: var(--color-primary); margin-left: 10px;">${starsHtml}</span>
          </div>
          <div class="review-item__actions">
            <button class="button button--small btn-edit-review" data-id="${review.id}" style="padding: 2px 8px; font-size: 10px;">Ред.</button>
            <button class="button button--small btn-delete-review" data-id="${review.id}" style="padding: 2px 8px; font-size: 10px; background: #dc3545;">Удалить</button>
          </div>
        </div>
        <p class="review-item__text" style="margin-top:10px; font-style:italic;">"${review.text}"</p>
      `;

      reviewElement.querySelector('.btn-edit-review').onclick = () => editReview(review);
      reviewElement.querySelector('.btn-delete-review').onclick = () => deleteReview(review.id);

      reviewsList.appendChild(reviewElement);
    });

    updateAverageRating(reviews);
  }

  function editReview(review) {
    document.getElementById('review-name').value = review.name;
    document.getElementById('review-text').value = review.text;
    ratingValueInput.value = review.rating;
    
    stars.forEach(s => {
      s.style.color = s.dataset.rating <= review.rating ? 'var(--color-primary)' : 'rgba(255,255,255,0.3)';
    });

    reviewForm.dataset.editId = review.id;
    reviewForm.querySelector('button[type="submit"]').textContent = 'Обновить отзыв';
    reviewForm.scrollIntoView({ behavior: 'smooth' });
  }

  function deleteReview(id) {
    if (confirm('Удалить этот отзыв?')) {
      const reviews = getFromStorage(STORAGE_KEY, []).filter(r => r.id !== id);
      saveToStorage(STORAGE_KEY, reviews);
      renderReviews();
    }
  }

  stars.forEach(star => {
    star.addEventListener('click', () => {
      const rating = star.dataset.rating;
      ratingValueInput.value = rating;
      stars.forEach(s => {
        s.style.color = s.dataset.rating <= rating ? 'var(--color-primary)' : 'rgba(255,255,255,0.3)';
      });
    });
  });

  reviewForm.onsubmit = (e) => {
    e.preventDefault();
    
    const rating = parseInt(ratingValueInput.value);
    if (rating === 0) {
      alert('Пожалуйста, выберите оценку!');
      return;
    }

    const reviews = getFromStorage(STORAGE_KEY, []);
    const editId = reviewForm.dataset.editId;

    if (editId) {
      const index = reviews.findIndex(r => r.id == editId);
      if (index !== -1) {
        reviews[index] = {
          ...reviews[index],
          name: document.getElementById('review-name').value,
          rating: rating,
          text: document.getElementById('review-text').value
        };
      }
      delete reviewForm.dataset.editId;
      reviewForm.querySelector('button[type="submit"]').textContent = 'Оставить отзыв';
    } else {
      const newReview = {
        id: Date.now(),
        name: document.getElementById('review-name').value,
        rating: rating,
        text: document.getElementById('review-text').value
      };
      reviews.push(newReview);
    }

    saveToStorage(STORAGE_KEY, reviews);
    reviewForm.reset();
    ratingValueInput.value = '0';
    stars.forEach(s => s.style.color = '');
    renderReviews();
  };

  renderReviews();
}