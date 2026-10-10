import { useMemo } from 'react';
import { useIdioma } from './IdiomaContext';
import * as EMPRESA_ES from '../data/empresa';
import * as EMPRESA_EN from '../data/empresa.en';
import { CATEGORIAS, MARCAS, PRODUCTOS } from '../data/catalogo';
import { CATEGORIAS_EN, MARCAS_EN, PRODUCTOS_EN, DESCRIPCION_PENDIENTE_EN } from '../data/catalogo.en';

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

/** Catálogo (categorías, marcas y productos) en el idioma activo. */
export function useCatalogo() {
  const { idioma } = useIdioma();
  return useMemo(() => (idioma === 'en' ? CATALOGO_EN : CATALOGO_ES), [idioma]);
}
