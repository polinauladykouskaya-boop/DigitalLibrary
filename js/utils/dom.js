export function createElement(tag, classes = [], attributes = {}) {
  const element = document.createElement(tag);
  if (classes.length) {
    element.classList.add(...classes);
  }
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  return element;
}

export function clearElement(element) {
  if (element) {
    element.innerHTML = '';
  }
}
