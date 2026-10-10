import { useEffect } from 'react';
import { useIdioma } from '../i18n/IdiomaContext';

const BASE = 'Deep Service Chile';

/** Título de pestaña y meta descripción; se actualizan al cambiar de idioma. */
export function useDocumentTitle(titulo, descripcion) {
  const { t } = useIdioma();
  const lema = t('Electrónica marina', 'Marine electronics');
  useEffect(() => {
    document.title = titulo ? `${titulo} · ${BASE}` : `${BASE} · ${lema}`;
    if (descripcion) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', descripcion);
    }
  }, [titulo, descripcion, lema]);
}
