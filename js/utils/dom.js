export function createElement(tagName, classNames = [], attributes = {}) {
  const element = document.createElement(tagName);

  if (classNames.length > 0) {
    element.classList.add(...classNames);
  }

  Object.keys(attributes).forEach((key) => {
    element.setAttribute(key, attributes[key]);
  });

  return element;
}

export function clearElement(element) {
  if (element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }
}

export function toggleClass(element, className, force) {
  if (element) {
    element.classList.toggle(className, force);
  }
}

export function getElement(selector) {
  return document.querySelector(selector);
}

export function getAllElements(selector) {
  return document.querySelectorAll(selector);
}

export function setElementText(selector, text) {
  const element = getElement(selector);
  if (element) {
    element.textContent = text;
  }
}

export function setElementHtml(selector, html) {
  const element = getElement(selector);
  if (element) {
    element.innerHTML = html;
  }
}