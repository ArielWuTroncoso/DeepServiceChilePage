import { useEffect } from 'react';

const BASE = 'Deep Service Chile';

export function useDocumentTitle(titulo, descripcion) {
  useEffect(() => {
    document.title = titulo ? `${titulo} · ${BASE}` : `${BASE} · Electrónica marina`;
    if (descripcion) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', descripcion);
    }
  }, [titulo, descripcion]);
}
