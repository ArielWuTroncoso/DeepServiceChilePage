import { useEffect, useRef } from 'react';

const ENFOCABLES = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Ventana modal accesible: el foco queda dentro, Escape y el fondo la cierran (salvo `bloqueado`),
 * el fondo de la página no se desplaza y al cerrar el foco vuelve a donde estaba.
 */
export default function Modal({ titulo, idTitulo, onCerrar, bloqueado = false, ancho = 'normal', children }) {
  const tarjeta = useRef(null);
  const cerrar = useRef(onCerrar);
  useEffect(() => { cerrar.current = onCerrar; }, [onCerrar]);

  useEffect(() => {
    const previo = document.activeElement;
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const nodos = () => [...(tarjeta.current?.querySelectorAll(ENFOCABLES) ?? [])];
    const primero = tarjeta.current?.querySelector('[data-foco-inicial]') ?? nodos()[0];
    primero?.focus();

    const alTeclear = (e) => {
      if (e.key === 'Escape' && !bloqueado) { e.preventDefault(); cerrar.current?.(); return; }
      if (e.key !== 'Tab') return;
      const lista = nodos();
      if (lista.length === 0) { e.preventDefault(); return; }
      const inicio = lista[0];
      const fin = lista[lista.length - 1];
      if (e.shiftKey && document.activeElement === inicio) { e.preventDefault(); fin.focus(); }
      else if (!e.shiftKey && document.activeElement === fin) { e.preventDefault(); inicio.focus(); }
      else if (!tarjeta.current?.contains(document.activeElement)) { e.preventDefault(); inicio.focus(); }
    };
    document.addEventListener('keydown', alTeclear);
    return () => {
      document.removeEventListener('keydown', alTeclear);
      document.body.style.overflow = overflowPrevio;
      if (previo instanceof HTMLElement) previo.focus();
    };
  }, [bloqueado]);

  const alFondo = (e) => { if (!bloqueado && e.target === e.currentTarget) onCerrar?.(); };

  return (
    <div className="modal" role="presentation" onMouseDown={alFondo}>
      <div
        ref={tarjeta}
        className={`modal__card${ancho === 'ancho' ? ' modal__card--ancho' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
      >
        {titulo}
        {children}
      </div>
    </div>
  );
}
