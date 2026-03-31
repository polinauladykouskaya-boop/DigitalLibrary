const STORAGE_KEY = 'books';

export function initBooks() {
  const form = document.getElementById('book-form');
  const list = document.getElementById('books-list');
  const sort = document.getElementById('sort-books');

  function getBooks() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  }

  function saveBooks(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function render() {
    let books = getBooks();

    if (sort.value === 'title') {
      books.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      books.sort((a, b) => b.date - a.date);
    }

    list.innerHTML = '';

    books.forEach(book => {
      const div = document.createElement('div');
      div.innerHTML = `
        <b>${book.title}</b> (${book.author})
        <button data-id="${book.id}" class="open">Открыть</button>
        <button data-id="${book.id}" class="edit">✏️</button>
        <button data-id="${book.id}" class="delete">❌</button>
      `;
      list.appendChild(div);
    });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();

    const books = getBooks();
    books.push({
      id: Date.now(),
      title: document.getElementById('book-title').value,
      author: document.getElementById('book-author').value,
      date: Date.now()
    });

    saveBooks(books);
    render();
    form.reset();
  });

  list.addEventListener('click', e => {
    const id = Number(e.target.dataset.id);
    let books = getBooks();

    if (e.target.classList.contains('delete')) {
      books = books.filter(b => b.id !== id);
    }

    if (e.target.classList.contains('edit')) {
      const book = books.find(b => b.id === id);
      book.title = prompt('Название', book.title);
      book.author = prompt('Автор', book.author);
    }

    if (e.target.classList.contains('open')) {
      showPage('book-page');
    }

    saveBooks(books);
    render();
  });

  sort.addEventListener('change', render);

  render();
}