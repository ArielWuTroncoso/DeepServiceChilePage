import { useSyncExternalStore } from 'react';
import { estadoCatalogo } from '../services/catalogoService';

/**
 * Lo que decide el panel y el sitio público debe reflejar: qué equipos se dieron de baja y
 * qué equipos nuevos se agregaron. Se pide una vez por visita; si el servidor no responde
 * (por ejemplo, está despertando) el sitio sigue mostrando su catálogo propio sin esperar.
 *
 * La respuesta no contiene existencias ni ningún dato interno.
 */

const CLAVE = 'deepservice:catalogo-estado';
const VIGENCIA_MS = 5 * 60 * 1000;

const VACIO = Object.freeze({ ocultos: [], nuevos: [] });

function leerCache() {
  try {
    const crudo = sessionStorage.getItem(CLAVE);
    if (!crudo) return null;
    const { en, datos } = JSON.parse(crudo);
    return { en, datos: normalizar(datos) };
  } catch { return null; }
}

function guardarCache(datos) {
  try { sessionStorage.setItem(CLAVE, JSON.stringify({ en: Date.now(), datos })); } catch { /* ignorar */ }
}

/** Deja solo lo esperado, con los tipos correctos, venga lo que venga del servidor o del caché. */
export function normalizar(datos) {
  if (!datos || typeof datos !== 'object' || !Array.isArray(datos.ocultos) || !Array.isArray(datos.nuevos)) return VACIO;
  return {
    ocultos: datos.ocultos.filter((s) => typeof s === 'string'),
    nuevos: datos.nuevos.filter((p) => p && typeof p.slug === 'string' && typeof p.nombre === 'string'),
  };
}

/** Respuesta de /api/catalogo/estado → { ocultos, nuevos } (nuevos = activos ya en forma de ficha local). */
export function desdeRespuesta(resp, slugsLocales) {
  if (!resp || !Array.isArray(resp.activos) || !Array.isArray(resp.ocultos)) return VACIO;
  const locales = new Set(slugsLocales);
  const nuevos = resp.activos
    .filter((p) => p && typeof p.slug === 'string' && !locales.has(p.slug))
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      nombre: p.nombre,
      marca: p.marca,
      categoria: p.categoria,
      subcategoria: p.subcategoria ?? '',
      destacado: Boolean(p.destacado),
      completo: Boolean(p.completo),
      resumen: p.resumen ?? '',
      descripcion: p.descripcion ?? '',
      especificaciones: Array.isArray(p.especificaciones) ? p.especificaciones : [],
      destacados: [],
      chips: [],
      imagen: p.imagenUrl ?? null,
      galeria: p.imagenUrl ? [{ src: p.imagenUrl, alt: p.nombre }] : [],
    }));
  return { ocultos: resp.ocultos.filter((s) => typeof s === 'string'), nuevos };
}

let actual = leerCache()?.datos ?? VACIO;
let pedido = false;
const oyentes = new Set();

const suscribir = (fn) => { oyentes.add(fn); return () => oyentes.delete(fn); };
const instantanea = () => actual;

function publicar(datos) {
  actual = datos;
  oyentes.forEach((fn) => fn());
}

/** Pide el estado una sola vez por carga de página (salvo que el caché siga vigente). */
export function cargarEstadoCatalogo(slugsLocales) {
  if (pedido) return;
  pedido = true;
  const cache = leerCache();
  if (cache && Date.now() - cache.en < VIGENCIA_MS) return;

  estadoCatalogo()
    .then((resp) => {
      const datos = desdeRespuesta(resp, slugsLocales);
      // Los equipos nuevos se vuelven a calcular al leer el caché, así que se guarda la respuesta ya reducida.
      guardarCache(datos);
      publicar(datos);
    })
    .catch(() => { /* sin conexión o servidor dormido: se queda el catálogo propio */ });
}

export function useEstadoCatalogo() {
  return useSyncExternalStore(suscribir, instantanea, instantanea);
}

/** Solo para pruebas. */
export function _reiniciar() { actual = VACIO; pedido = false; oyentes.clear(); }
