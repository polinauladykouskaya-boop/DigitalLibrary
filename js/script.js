document.addEventListener('DOMContentLoaded', function() {
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  
  if (burger && nav) {
    burger.addEventListener('click', function() {
      nav.classList.toggle('nav--active');
    });
  }
});