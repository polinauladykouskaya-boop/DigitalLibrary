import { getFromStorage, addToStorageArray, removeFromStorageArray } from '../utils/storage.js';
import { createElement, clearElement } from '../utils/dom.js';

const STORAGE_KEY = 'book_reviews_war_and_peace';

export function initReviews() {
  const reviewForm = document.getElementById('review-form');
  const reviewsList = document.getElementById('reviews-list');
  const ratingInput = document.getElementById('rating-input');
  const ratingHidden = document.getElementById('review-rating');
  const averageRatingStars = document.getElementById('average-rating-stars');
  const averageRatingValue = document.getElementById('average-rating-value');
  
  if (!reviewForm || !reviewsList) {
    console.warn('Элементы для отзывов не найдены');
    return;
  }

  let currentRating = 0;

  function loadReviews() {
    const reviews = getFromStorage(STORAGE_KEY, []);
    renderReviews(reviews);
    updateAverageRating(reviews);
  }

  function saveReview(review) {
    addToStorageArray(STORAGE_KEY, review);
    loadReviews();
  }

  function deleteReview(reviewId) {
    if (confirm('Вы уверены, что хотите удалить этот отзыв?')) {
      removeFromStorageArray(STORAGE_KEY, reviewId);
      loadReviews();
    }
  }

  function editReview(review) {
    if (confirm('Вы уверены, что хотите отредактировать этот отзыв? Он будет удален, и вы сможете написать новый.')) {
      deleteReview(review.id);
      document.getElementById('review-name').value = review.name;
      document.getElementById('review-text').value = review.text;
      setRating(review.rating);
      document.querySelector('.reviews-form').scrollIntoView({ behavior: 'smooth' });
    }
  }

  function setRating(rating) {
    currentRating = rating;
    ratingHidden.value = rating;
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
      if (index < rating) {
        star.classList.add('active');
      } else {
        star.classList.remove('active');
      }
    });
  }

  function renderReviews(reviews) {
    clearElement(reviewsList);
    
    if (reviews.length === 0) {
      const emptyMessage = createElement('p', ['reviews-empty']);
      emptyMessage.textContent = 'Пока нет отзывов. Будьте первым!';
      reviewsList.appendChild(emptyMessage);
      return;
    }
    
    reviews.forEach(review => {
      const article = createElement('article', ['review-card']);
      
      const header = createElement('header', ['review-card__header']);
      const name = createElement('h3', ['review-card__name']);
      name.textContent = review.name;
      const rating = createElement('p', ['review-card__rating']);
      rating.textContent = '\u2605'.repeat(review.rating) + '\u2606'.repeat(5 - review.rating);
      const date = createElement('time', ['review-card__date']);
      date.dateTime = review.date;
      date.textContent = new Date(review.date).toLocaleDateString('ru-RU');
      
      header.appendChild(name);
      header.appendChild(rating);
      header.appendChild(date);
      
      const text = createElement('p', ['review-card__text']);
      text.textContent = review.text;
      
      const footer = createElement('footer', ['review-card__actions']);
      const editBtn = createElement('button', ['button', 'button--small', 'button--secondary']);
      editBtn.textContent = 'Редактировать';
      editBtn.addEventListener('click', () => editReview(review));
      const deleteBtn = createElement('button', ['button', 'button--small', 'button--danger']);
      deleteBtn.textContent = 'Удалить';
      deleteBtn.addEventListener('click', () => deleteReview(review.id));
      
      footer.appendChild(editBtn);
      footer.appendChild(deleteBtn);
      
      article.appendChild(header);
      article.appendChild(text);
      article.appendChild(footer);
      
      reviewsList.appendChild(article);
    });
  }

  function updateAverageRating(reviews) {
    if (reviews.length === 0) {
      if (averageRatingStars) averageRatingStars.textContent = '\u2606\u2606\u2606\u2606\u2606';
      if (averageRatingValue) averageRatingValue.textContent = '0.0';
      return;
    }
    
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    const average = sum / reviews.length;
    if (averageRatingStars) {
      const fullStars = Math.round(average);
      averageRatingStars.textContent = '\u2605'.repeat(fullStars) + '\u2606'.repeat(5 - fullStars);
    }
    if (averageRatingValue) averageRatingValue.textContent = average.toFixed(1);
  }

  function validateForm(name, text, rating) {
    if (!name.trim()) {
      alert('Пожалуйста, введите ваше имя');
      return false;
    }
    if (name.trim().length < 2) {
      alert('Имя должно содержать не менее 2 символов');
      return false;
    }
    if (rating === 0) {
      alert('Пожалуйста, поставьте оценку');
      return false;
    }
    if (!text.trim()) {
      alert('Пожалуйста, напишите отзыв');
      return false;
    }
    if (text.trim().length < 10) {
      alert('Отзыв должен содержать не менее 10 символов');
      return false;
    }
    return true;
  }

  reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('review-name').value;
    const text = document.getElementById('review-text').value;
    const rating = parseInt(ratingHidden.value, 10);
    
    if (validateForm(name, text, rating)) {
      const newReview = {
        id: Date.now().toString(),
        name: name.trim(),
        rating: rating,
        text: text.trim(),
        date: new Date().toISOString(),
      };
      
      saveReview(newReview);
      reviewForm.reset();
      setRating(0);
      
      alert('Отзыв успешно добавлен!');
    }
  });

  if (ratingInput) {
    ratingInput.addEventListener('click', (e) => {
      const star = e.target.closest('.star');
      if (star) {
        const rating = parseInt(star.dataset.rating, 10);
        setRating(rating);
      }
    });
  }

  loadReviews();
}