const STORAGE_KEY = 'news';

export function initNews() {
  const form = document.getElementById('news-form');
  const list = document.getElementById('news-list');
  const search = document.getElementById('news-search');

  function getNews() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  }

  function saveNews(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function render(news) {
    list.innerHTML = '';

    news.forEach(item => {
      const div = document.createElement('div');
      div.innerHTML = `
        <h3>${item.title}</h3>
        <p>${item.text}</p>
        <button data-id="${item.id}" class="edit">✏️</button>
        <button data-id="${item.id}" class="delete">❌</button>
      `;
      list.appendChild(div);
    });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();

    const news = getNews();
    news.push({
      id: Date.now(),
      title: document.getElementById('news-title').value,
      text: document.getElementById('news-text').value
    });

    saveNews(news);
    render(news);
    form.reset();
  });

  list.addEventListener('click', e => {
    const id = Number(e.target.dataset.id);
    let news = getNews();

    if (e.target.classList.contains('delete')) {
      news = news.filter(n => n.id !== id);
    }

    if (e.target.classList.contains('edit')) {
      const item = news.find(n => n.id === id);
      item.title = prompt('Заголовок', item.title);
      item.text = prompt('Текст', item.text);
    }

    saveNews(news);
    render(news);
  });

  search.addEventListener('input', () => {
    const query = search.value.toLowerCase();
    render(getNews().filter(n => n.title.toLowerCase().includes(query)));
  });

  render(getNews());
}