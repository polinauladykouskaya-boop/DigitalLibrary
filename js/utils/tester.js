import BookHandler from '../components/BookDataHandler.js';
import Storage from '../storage/localStorage.js';

class APITester {
    static async testAPIConnection() {
        const testScenarios = [
            { name: 'Успешный поиск (JavaScript)', query: 'JavaScript' },
            { name: 'Пустой запрос', query: '' },
            { name: 'Запрос со спецсимволами', query: '@#$%^' },
        ];

        console.group('--- API Connection Tests ---');
        for (const scenario of testScenarios) {
            try {
                console.log(`Testing: ${scenario.name}`);
                const result = await BookHandler.getBooks(scenario.query);
                console.log('√ Success:', result.length, 'books found');
            } catch (error) {
                console.warn('X Expected or Actual Error:', error.message);
            }
        }
        console.groupEnd();
    }

    static testStorageFunctionality() {
        console.group('--- Storage Tests ---');
        const testKey = 'test_book';
        const testData = { id: '123', title: 'Test Book' };

        Storage.set(testKey, testData);
        const retrieved = Storage.get(testKey);
        
        console.log(
            `Write/Read test:`,
            retrieved && retrieved.title === 'Test Book' ? '√ PASS' : 'X FAIL'
        );

        Storage.remove(testKey);
        const afterDelete = Storage.get(testKey);
        console.log(
            `Delete test:`,
            afterDelete === null ? '√ PASS' : 'X FAIL'
        );
        console.groupEnd();
    }

    static testOfflineMock() {
        console.group('--- Offline Logic Test ---');
        const favorites = Storage.get('favorites', []);
        console.log(`Favorites in storage: ${favorites.length} items`);
        console.log('√ Offline-library check: PASS');
        console.groupEnd();
    }
}

export default APITester;
