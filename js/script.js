document.addEventListener('DOMContentLoaded', function () {
  const button = document.getElementById('myButton');
  const message = document.getElementById('message');

  if (button) {
    button.addEventListener('click', function () {
      message.textContent = 'кнопка нажата';
      message.style.color = '#4CAF50';
    });
  }

  console.log('страница загружена и готова к работе');

  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');

  if (burger) {
    burger.addEventListener('click', function () {
      nav.classList.toggle('active');
    });
  }
});
