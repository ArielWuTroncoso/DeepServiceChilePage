import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/**
 * Idioma del sitio: español (por defecto) o inglés.
 *
 * Prioridad al cargar:  ?lang=en|es en la URL  >  elección guardada  >  español.
 * La elección se recuerda en el navegador y se refleja en <html lang>.
 *
 * Uso en componentes:
 *   const { idioma, t } = useIdioma();
 *   t('Inicio', 'Home')            → texto según el idioma activo
 *   formatoNumero(1234.5)          → "1.234,5" / "1,234.5"
 */

const IdiomaContext = createContext(null);
const CLAVE = 'deepservice:idioma';
export const IDIOMAS = ['es', 'en'];

function idiomaInicial() {
  if (typeof window === 'undefined') return 'es';
  try {
    const url = new URLSearchParams(window.location.search).get('lang');
    if (IDIOMAS.includes(url)) return url;
  } catch { /* URL no disponible */ }
  try {
    const guardado = localStorage.getItem(CLAVE);
    if (IDIOMAS.includes(guardado)) return guardado;
  } catch { /* almacenamiento no disponible */ }
  return 'es';
}

export function IdiomaProvider({ children }) {
  const [idioma, setIdioma] = useState(idiomaInicial);

  useEffect(() => {
    document.documentElement.setAttribute('lang', idioma === 'en' ? 'en' : 'es-CL');
    try { localStorage.setItem(CLAVE, idioma); } catch { /* ignorar */ }
  }, [idioma]);

  const t = useCallback((es, en) => (idioma === 'en' ? en : es), [idioma]);
  const alternarIdioma = useCallback(() => setIdioma((i) => (i === 'en' ? 'es' : 'en')), []);
  const formatoNumero = useCallback(
    (n, opciones) => new Intl.NumberFormat(idioma === 'en' ? 'en-US' : 'es-CL', opciones).format(n),
    [idioma],
  );

  const valor = useMemo(
    () => ({ idioma, setIdioma, alternarIdioma, t, formatoNumero, en: idioma === 'en' }),
    [idioma, alternarIdioma, t, formatoNumero],
  );
  return <IdiomaContext.Provider value={valor}>{children}</IdiomaContext.Provider>;
}

export function useIdioma() {
  const ctx = useContext(IdiomaContext);
  if (!ctx) throw new Error('useIdioma debe usarse dentro de IdiomaProvider');
  return ctx;
}
