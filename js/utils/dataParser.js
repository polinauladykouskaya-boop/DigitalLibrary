export const parseJSON = (jsonString) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('JSON parsing error:', error);
    return null;
  }
};

export const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Неизвестно';
    }
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Ошибка даты';
  }
};

export const truncateText = (text, maxLength, userWordBoundary = true) => {
  if (!text || text.length <= maxLength) return text;
  let truncated = text.substr(0, maxLength);
  if (userWordBoundary) {
    truncated = truncated.substr(
      0,
      Math.min(truncated.length, truncated.lastIndexOf(' ')),
    );
  }
  return truncated + '...';
};

export const createElementFromData = (data, template) => {
  try {
    let html = template;
    Object.keys(data).forEach((key) => {
      const placeholder = `{{${key}}}`;
      const value = data[key] || '';
      html = html.replace(new RegExp(placeholder, 'g'), value);
    });
    const templateElement = document.createElement('template');
    templateElement.innerHTML = html.trim();
    return templateElement.content.firstElementChild;
  } catch (error) {
    console.error('Error creating element from template:', error);
    return document.createElement('div');
  }
};

export const formatNumber = (number, options = {}) => {
  const defaults = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  };
  return new Intl.NumberFormat('ru-RU', { ...defaults, ...options }).format(number);
};

export const formatCurrency = (amount, currency = 'RUB') => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const buildQueryString = (params) => {
  const searchParams = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    if (params[key] !== null && params[key] !== undefined) {
      searchParams.append(key, params[key]);
    }
  });
  return searchParams.toString();
};

export const getNestedValue = (obj, path, defaultValue = null) => {
  try {
    const value = path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : defaultValue;
    }, obj);
    return value !== undefined ? value : defaultValue;
  } catch (error) {
    console.error('Error getting nested value:', error);
    return defaultValue;
  }
};

export const filterData = (data, filters) => {
  return data.filter((item) => {
    return Object.keys(filters).every((key) => {
      const filterValue = filters[key];
      const itemValue = item[key];
      if (filterValue === '' || filterValue === null || filterValue === undefined) {
        return true;
      }
      if (typeof filterValue === 'string') {
        return itemValue?.toString().toLowerCase().includes(filterValue.toLowerCase());
      }
      return itemValue === filterValue;
    });
  });
};

export const sortData = (data, key, direction = 'asc') => {
  return [...data].sort((a, b) => {
    let valueA = a[key];
    let valueB = b[key];
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      valueA = valueA.toLowerCase();
      valueB = valueB.toLowerCase();
    }
    if (valueA < valueB) return direction === 'asc' ? -1 : 1;
    if (valueA > valueB) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

export const generateId = (prefix = '') => {
  return prefix + Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const isObject = (value) => {
  return value && typeof value === 'object' && !Array.isArray(value);
};

export const isArray = (value) => {
  return Array.isArray(value);
};

