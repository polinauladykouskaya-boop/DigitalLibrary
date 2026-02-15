document.addEventListener('DOMContentLoaded', function() {

    const button = document.getElementById('myButton');
    const message = document.getElementById('message');

    button.addEventListener('click', function() {
        message.textContent = 'кнопка нажата';
        message.style.color = '#4CAF50';
    });

       console.log('cтраница загружена и готова к работе');
    });