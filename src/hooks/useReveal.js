import { useEffect, useRef } from 'react';

/** Añade la clase is-visible cuando el elemento entra en pantalla. */
export function useReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const nodo = ref.current;
    if (!nodo) return undefined;

    if (!('IntersectionObserver' in window)) { nodo.classList.add('is-visible'); return undefined; }

    const observer = new IntersectionObserver(([entrada]) => {
      if (entrada.isIntersecting) {
        nodo.classList.add('is-visible');
        observer.unobserve(nodo);
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px', ...options });

    observer.observe(nodo);
    return () => observer.disconnect();
  }, [options]);

  return ref;
}
