import { createElement } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import './styles/global.css';
import { islands } from './islands';
import { initTenda } from './lib/tenda';

declare global {
  interface Window {
    __vm?: boolean;
  }
}
window.__vm = true;
document.documentElement.classList.add('js');

const root = document.getElementById('root')!;

if (root.hasAttribute('data-prerendered')) {
  // Sito pubblicato: HTML già pronto, si idratano solo le isole interattive.
  initTenda();
  root.querySelectorAll<HTMLElement>('[data-island]').forEach(async (el) => {
    const load = islands[el.dataset.island!];
    if (!load) return;
    const { default: Component } = await load();
    hydrateRoot(el, createElement(Component, JSON.parse(el.dataset.props || '{}')));
  });
} else {
  // Sviluppo e anteprima di Lovable: l'app intera è renderizzata nel browser.
  import('./App').then(({ App }) => {
    createRoot(root).render(createElement(App, { url: window.location.pathname }));
    requestAnimationFrame(() => initTenda());
  });
}
