export function getFromStorage(key, defaultValue = []) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Ошибка при получении данных из localStorage по ключу "${key}":`, error);
    return defaultValue;
  }
}

export function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Ошибка при сохранении данных в localStorage по ключу "${key}":`, error);
  }
}

export function addToStorageArray(key, item) {
  try {
    const items = getFromStorage(key, []);
    if (item.id && !items.some(existing => existing.id === item.id)) {
      items.push(item);
      saveToStorage(key, items);
      return true;
    } else if (!item.id) {
      items.push(item);
      saveToStorage(key, items);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Ошибка при добавлении элемента в localStorage по ключу "${key}":`, error);
    return false;
  }
}

export function removeFromStorageArray(key, id) {
  try {
    let items = getFromStorage(key, []);
    const initialLength = items.length;
    items = items.filter(item => item.id !== id);
    if (items.length !== initialLength) {
      saveToStorage(key, items);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Ошибка при удалении элемента из localStorage по ключу "${key}":`, error);
    return false;
  }
}
