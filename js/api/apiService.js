import { CONFIG } from './config.js';

class ApiService {
    constructor() {
        // Базовый URL для Google Books API
        this.baseUrl = 'https://www.googleapis.com/books/v1/volumes';
        // Ключ берется из конфига (требование безопасности Шаг 5)
        this.apiKey = CONFIG.API_KEY || '';
    }

    /**
     * Универсальный метод для выполнения защищенных запросов
     * @param {string} endpoint - конечная точка (например, '/search')
     * @param {Object} params - параметры запроса (q, maxResults и т.д.)
     */
        async get(endpoint, params = {}, retries = 2) { // добавили retries
        const controller = new AbortController(); // добавили AbortController
        const timeoutId = setTimeout(() => controller.abort(), 8000); // Таймаут 8 сек

        const searchParams = new URLSearchParams({ ...params, key: this.apiKey });
        const url = `${this.baseUrl}?${searchParams.toString()}`;

        try {
            const response = await fetch(url, {
                signal: controller.signal, // привязываем сигнал отмены
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' }
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                // Логика повторных попыток (Retry)
                if (retries > 0 && response.status >= 500) {
                    console.log(`Retry... Attempts left: ${retries}`);
                    return this.get(endpoint, params, retries - 1);
                }
                await this.handleHttpError(response);
            }

            return await response.json();
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Превышено время ожидания (таймаут)');
            }
            throw error;
        }
    }


    /**
     * Обработка специфических ошибок API (401, 404, 429)
     */
    async handleHttpError(response) {
        let message = `Ошибка: ${response.status}`;
        
        switch (response.status) {
            case 401:
                message = 'Ошибка авторизации. Проверьте API-ключ в config.js';
                break;
            case 404:
                message = 'Запрашиваемые данные не найдены на сервере';
                break;
            case 429:
                message = 'Превышен лимит запросов. Попробуйте позже';
                break;
            case 500:
                message = 'Внутренняя ошибка сервера Google API';
                break;
        }
        
        throw new Error(message);
    }
}

// Экспортируем экземпляр класса (Singleton), чтобы использовать один конфиг везде
export default new ApiService();
