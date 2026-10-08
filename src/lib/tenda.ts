/**
 * La tenda: ogni immagine [data-tenda] si scopre una volta sola quando è
 * visibile per il 20%. Le regole CSS sono in src/styles/global.css.
 * Si osserva il contenitore e non l'elemento: Chrome tiene conto del suo
 * clip-path, che a tenda chiusa ha area zero e non risulterebbe mai visibile.
 */
export function initTenda(root: ParentNode = document) {
  const els = Array.from(root.querySelectorAll<HTMLElement>('[data-tenda]:not(.is-open)'));
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-open'));
    return;
  }
  const targets = new Map<Element, HTMLElement>();
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const el = targets.get(e.target);
        if (e.isIntersecting && el) {
          el.classList.add('is-open');
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.2 },
  );
  for (const el of els) {
    const parent = el.parentElement ?? el;
    targets.set(parent, el);
    io.observe(parent);
  }
}
