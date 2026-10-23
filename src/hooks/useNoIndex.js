import { useEffect } from 'react';

/** Pide a los buscadores que no indexen esta pantalla (panel y accesos internos). */
export function useNoIndex() {
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.setAttribute('name', 'robots');
    meta.setAttribute('content', 'noindex, nofollow');
    document.head.appendChild(meta);
    return () => { meta.remove(); };
  }, []);
}
