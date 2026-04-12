class LocalStorageService {
    constructor() {
        this.storage = window.localStorage;
        this.initializeStorage();
    }

    initializeStorage() {
        if (!this.get('app_settings')) {
            this.set('app_settings', {
                theme: 'light',
                language: 'ru',
                cacheDuration: 3600000, 
            });
        }
        
        if (!this.get('favorites')) {
            this.set('favorites', []);
        }
    }

    set(key, value) {
        try {
            const item = {
                value: value,
                timestamp: new Date().getTime(),
            };
            const serializedValue = JSON.stringify(item);
            this.storage.setItem(key, serializedValue);
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    }

    get(key, defaultValue = null, maxAge = null) {
        try {
            const item = this.storage.getItem(key);
            if (!item) return defaultValue;

            const parsedItem = JSON.parse(item);

            if (maxAge && new Date().getTime() - parsedItem.timestamp > maxAge) {
                this.remove(key);
                return defaultValue;
            }

            return parsedItem.value;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return defaultValue;
        }
    }

    remove(key) {
        try {
            this.storage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    }

    clearExpired() {
        const settings = this.get('app_settings');
        const cacheDuration = settings?.cacheDuration || 3600000;
        const now = new Date().getTime();

        Object.keys(this.storage).forEach((key) => {
            if (key !== 'app_settings' && key !== 'favorites') {
                const item = this.storage.getItem(key);
                if (item) {
                    try {
                        const parsedItem = JSON.parse(item);
                        if (now - parsedItem.timestamp > cacheDuration) {
                            this.remove(key);
                        }
                    } catch (error) {
                        this.remove(key);
                    }
                }
            }
        });
    }

    getAllKeys() {
        return Object.keys(this.storage);
    }

    hasValid(key, maxAge = null) {
        return this.get(key, null, maxAge) !== null;
    }
}

export default new LocalStorageService();
