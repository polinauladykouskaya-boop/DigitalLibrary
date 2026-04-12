export function saveToSession(key, data) {
    sessionStorage.setItem(key, JSON.stringify(data));
}

export function getFromSession(key) {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}
