export function getFromStorage(key, defaultValue = []) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Ошибка при получении данных:`, error);
    return defaultValue;
  }
}

export function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Ошибка при сохранении:`, error);
  }
}

export function addToStorageArray(key, item) {
  const items = getFromStorage(key, []);
  
  const exists = item.id 
    ? items.some(existing => existing.id === item.id)
    : items.includes(item);

  if (!exists) {
    items.push(item);
    saveToStorage(key, items);
    return true;
  }
  return false;
}

export function removeFromStorageArray(key, identifier) {
  let items = getFromStorage(key, []);
  const initialLength = items.length;

  items = items.filter(item => {
    if (typeof item === 'object' && item !== null && item.id) {
      return item.id !== identifier;
    }
    return item !== identifier;
  });

  if (items.length !== initialLength) {
    saveToStorage(key, items);
    return true;
  }
  return false;
}