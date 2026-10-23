import { useMemo } from 'react';
import { useIdioma } from './IdiomaContext';
import * as EMPRESA_ES from '../data/empresa';
import * as EMPRESA_EN from '../data/empresa.en';
import { CATEGORIAS, MARCAS, PRODUCTOS } from '../data/catalogo';
import { CATEGORIAS_EN, MARCAS_EN, PRODUCTOS_EN, DESCRIPCION_PENDIENTE_EN } from '../data/catalogo.en';
import { useEstadoCatalogo } from './catalogoRemoto';

/** Datos de la empresa en el idioma activo (mismas claves en ambos). */
export function useEmpresa() {
  const { idioma } = useIdioma();
  return idioma === 'en' ? EMPRESA_EN : EMPRESA_ES;
}

function productoEn(p) {
  const en = PRODUCTOS_EN[p.slug] ?? {};
  const galeria = (p.galeria ?? []).map((g, i) => ({ ...g, alt: en.galeriaAlt?.[i] ?? g.alt }));
  return {
    ...p,
    ...en,
    descripcion: en.descripcion ?? (p.completo ? p.descripcion : DESCRIPCION_PENDIENTE_EN),
    galeria,
  };
}

function armar(categorias, marcas, productos) {
  return {
    CATEGORIAS: categorias,
    MARCAS: marcas,
    PRODUCTOS: productos,
    nombreCategoria: (slug) => categorias.find((c) => c.slug === slug)?.nombre ?? slug,
    nombreMarca: (slug) => marcas.find((m) => m.slug === slug)?.nombre ?? slug,
  };
}

const CATALOGO_ES = armar(CATEGORIAS, MARCAS, PRODUCTOS);
const CATALOGO_EN = armar(
  CATEGORIAS.map((c) => ({ ...c, ...CATEGORIAS_EN[c.slug] })),
  MARCAS.map((m) => ({ ...m, ...MARCAS_EN[m.slug] })),
  PRODUCTOS.map(productoEn),
);

/**
 * Catálogo (categorías, marcas y productos) en el idioma activo.
 *
 * Parte de los datos propios del sitio y le aplica lo que decide el panel: los equipos dados
 * de baja dejan de verse y los equipos nuevos aparecen (ver catalogoRemoto.js).
 */
export function useCatalogo() {
  const { idioma } = useIdioma();
  const estado = useEstadoCatalogo();
  return useMemo(() => {
    const base = idioma === 'en' ? CATALOGO_EN : CATALOGO_ES;
    if (estado.ocultos.length === 0 && estado.nuevos.length === 0) return base;
    const ocultos = new Set(estado.ocultos);
    const productos = [...base.PRODUCTOS.filter((p) => !ocultos.has(p.slug)), ...estado.nuevos];
    return armar(base.CATEGORIAS, base.MARCAS, productos);
  }, [idioma, estado]);
}

/** Identificadores de los equipos que trae el sitio (para distinguir los que agrega el panel). */
export const SLUGS_LOCALES = PRODUCTOS.map((p) => p.slug);
