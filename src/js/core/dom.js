export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

export function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

export function setFeedback(element, type, message) {
  if (!element) return;
  element.className = `feedback${type ? ` ${type}` : ''}`;
  element.textContent = message;
}

export function createElement(tag, options = {}) {
  const element = document.createElement(tag);
  if (options.className) element.className = options.className;
  if (options.text) element.textContent = options.text;
  if (options.dataset) Object.assign(element.dataset, options.dataset);
  return element;
}
