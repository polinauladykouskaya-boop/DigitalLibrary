import ApiService from '../api/apiService.js';
import { truncateText, formatDate } from '../utils/dataParser.js';

class BookDataHandler {
    async getBooks(query) {
        try {
            const data = await ApiService.get('', { q: query });
            return data.items ? data.items.map(item => this.formatBookData(item)) : [];
        } catch (error) {
            throw new Error(`Ошибка API: ${error.message}`);
        }
    }

    formatBookData(rawData) {
        const info = rawData.volumeInfo;
        return {
            id: rawData.id,
            title: info.title || 'Без названия',
            authors: info.authors?.join(', ') || 'Автор не указан',
            description: truncateText(info.description || 'Описание отсутствует', 150),
            image: info.imageLinks?.thumbnail || 'https://via.placeholder.com/150x200?text=No+Cover',
            date: formatDate(info.publishedDate),
            raw: rawData 
        };
    }

    renderBooks(books, container, onSave) {
        if (!container) return;
        
        if (books.length === 0) {
            container.innerHTML = '<p class="no-data">Книги не найдены. Попробуйте другой запрос.</p>';
            return;
        }

        container.innerHTML = books.map(book => `
            <div class="book-card" style="border: 1px solid #ddd; padding: 15px; border-radius: 8px; background: white;">
                <img src="${book.image}" alt="${book.title}" style="width: 100%; height: 200px; object-fit: contain;">
                <h3 style="font-size: 1.1em; margin: 10px 0;">${book.title}</h3>
                <p style="color: #666; font-size: 0.9em;">${book.authors}</p>
                <button class="btn-save button button--primary" style="width: 100%; margin-top: 10px;">В избранное</button>
            </div>
        `).join('');

        const buttons = container.querySelectorAll('.btn-save');
        buttons.forEach((btn, index) => {
            btn.addEventListener('click', () => onSave(books[index]));
        });
    }
}

export default new BookDataHandler();
