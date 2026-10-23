import { describe, expect, it } from 'vitest';
import {
  ajustarSeleccion, especificacionesATexto, estadoStock, filtrarInventario, generarSlug,
  normalizar, opcionesCascada, parsearEspecificaciones, resumenInventario, stockResultante, validarEquipo,
} from './inventario';

const item = (id, nombre, categoria, marca, stock = 0, stockMinimo = 0, extra = {}) =>
  ({ productoId: id, slug: nombre.toLowerCase(), nombre, subcategoria: '', categoria, marca, activo: true, stock, stockMinimo, ...extra });

const ITEMS = [
  item(1, 'FCV-800', 'pesca', 'furuno', 5, 2),
  item(2, 'CH-500', 'pesca', 'furuno', 1, 2),
  item(3, 'Sensores de captura', 'pesca', 'marport', 0),
  item(4, 'Radio VHF', 'comunicaciones', 'icom', 10),
  item(5, 'Plóter cartográfico', 'navegacion', 'garmin', 3, 0, { activo: false }),
];

describe('normalizar', () => {
  it('quita tildes y pasa a minúsculas', () => {
    expect(normalizar('  Plóter CARTOGRÁFICO ')).toBe('ploter cartografico');
  });
});

describe('estadoStock', () => {
  it('distingue agotado, bajo y normal', () => {
    expect(estadoStock(item(1, 'a', 'x', 'y', 0, 2))).toBe('sin');
    expect(estadoStock(item(1, 'a', 'x', 'y', 2, 2))).toBe('bajo');
    expect(estadoStock(item(1, 'a', 'x', 'y', 3, 2))).toBe('ok');
  });
  it('sin mínimo definido, mientras haya unidades está normal', () => {
    expect(estadoStock(item(1, 'a', 'x', 'y', 1, 0))).toBe('ok');
  });
});

describe('opcionesCascada', () => {
  it('sin selección ofrece todas las categorías con su cantidad', () => {
    const { categorias, marcas, equipos } = opcionesCascada(ITEMS, {});
    expect(categorias.map((c) => [c.valor, c.total])).toEqual([['comunicaciones', 1], ['navegacion', 1], ['pesca', 3]]);
    expect(marcas).toHaveLength(4);
    expect(equipos).toHaveLength(5);
  });
  it('al elegir categoría, las marcas y equipos se acotan a ella', () => {
    const { marcas, equipos } = opcionesCascada(ITEMS, { categoria: 'pesca' });
    expect(marcas.map((m) => m.valor).sort()).toEqual(['furuno', 'marport']);
    expect(equipos.map((e) => e.etiqueta)).toEqual(['CH-500', 'FCV-800', 'Sensores de captura']);
  });
  it('al elegir categoría y marca, solo quedan sus equipos', () => {
    const { equipos } = opcionesCascada(ITEMS, { categoria: 'pesca', marca: 'furuno' });
    expect(equipos.map((e) => e.valor)).toEqual(['2', '1']);
  });
  it('usa los nombres entregados', () => {
    const { categorias } = opcionesCascada(ITEMS, {}, { categoria: (s) => s.toUpperCase() });
    expect(categorias[0].etiqueta).toBe('COMUNICACIONES');
  });
});

describe('ajustarSeleccion', () => {
  it('limpia la marca y el equipo que ya no pertenecen a la categoría', () => {
    expect(ajustarSeleccion(ITEMS, { categoria: 'comunicaciones', marca: 'furuno', producto: '1' }))
      .toEqual({ categoria: 'comunicaciones', marca: '', producto: '' });
  });
  it('conserva lo que sigue siendo válido', () => {
    const s = { categoria: 'pesca', marca: 'furuno', producto: '1' };
    expect(ajustarSeleccion(ITEMS, s)).toEqual(s);
  });
  it('limpia solo el equipo si es de otra marca', () => {
    expect(ajustarSeleccion(ITEMS, { categoria: 'pesca', marca: 'marport', producto: '1' }))
      .toEqual({ categoria: 'pesca', marca: 'marport', producto: '' });
  });
});

describe('filtrarInventario', () => {
  it('combina cascada y texto sin importar tildes', () => {
    expect(filtrarInventario(ITEMS, { texto: 'ploter' }).map((i) => i.productoId)).toEqual([5]);
    expect(filtrarInventario(ITEMS, { categoria: 'pesca', texto: 'sensor' }).map((i) => i.productoId)).toEqual([3]);
  });
  it('filtra por equipo exacto', () => {
    expect(filtrarInventario(ITEMS, { producto: '4' })).toHaveLength(1);
  });
  it('stock bajo incluye agotados y bajo mínimo, no los normales', () => {
    expect(filtrarInventario(ITEMS, { soloBajo: true }).map((i) => i.productoId)).toEqual([2, 3]);
  });
  it('puede ocultar equipos dados de baja', () => {
    expect(filtrarInventario(ITEMS, { ocultarInactivos: true })).toHaveLength(4);
  });
});

describe('resumenInventario', () => {
  it('suma equipos, unidades y alertas', () => {
    expect(resumenInventario(ITEMS)).toEqual({ equipos: 5, unidades: 19, bajo: 1, sin: 1 });
  });
});

describe('stockResultante', () => {
  it('calcula entrada, salida y ajuste', () => {
    expect(stockResultante(5, 'ENTRADA', 3)).toBe(8);
    expect(stockResultante(5, 'SALIDA', 5)).toBe(0);
    expect(stockResultante(5, 'AJUSTE', 12)).toBe(12);
  });
  it('rechaza retirar más de lo que hay y cantidades inválidas', () => {
    expect(stockResultante(5, 'SALIDA', 6)).toBeNull();
    expect(stockResultante(5, 'ENTRADA', -1)).toBeNull();
    expect(stockResultante(5, 'ENTRADA', 1.5)).toBeNull();
    expect(stockResultante(5, 'ENTRADA', '')).toBeNull();
    expect(stockResultante(5, 'AJUSTE', '')).toBeNull();
    expect(stockResultante(5, 'AJUSTE', '1e2')).toBeNull();
    expect(stockResultante(5, 'AJUSTE', '  ')).toBeNull();
    expect(stockResultante(5, 'AJUSTE', undefined)).toBeNull();
  });
  it('respeta el máximo de stock', () => {
    expect(stockResultante(999_999, 'ENTRADA', 1)).toBe(1_000_000);
    expect(stockResultante(999_999, 'ENTRADA', 2)).toBeNull();
    expect(stockResultante(0, 'AJUSTE', 1_000_001)).toBeNull();
    expect(stockResultante(5, 'AJUSTE', '0')).toBe(0);
  });
});

describe('generarSlug', () => {
  it('genera un identificador válido', () => {
    expect(generarSlug('Sonda FCV-800 (nueva)')).toBe('sonda-fcv-800-nueva');
    expect(generarSlug('  Plóter & Radar  ')).toBe('ploter-y-radar');
    expect(generarSlug('!!!')).toBe('');
  });
});

describe('especificaciones', () => {
  it('lee una por línea y respeta los dos puntos del valor', () => {
    const lista = parsearEspecificaciones('Pantalla: 8,4" TFT\nAlimentación: 12 - 24 V CC\n\nsin dos puntos\nHora: 10:30');
    expect(lista).toEqual([
      { clave: 'Pantalla', valor: '8,4" TFT', orden: 0 },
      { clave: 'Alimentación', valor: '12 - 24 V CC', orden: 1 },
      { clave: 'Hora', valor: '10:30', orden: 2 },
    ]);
  });
  it('ida y vuelta', () => {
    const t = 'A: 1\nB: dos';
    expect(especificacionesATexto(parsearEspecificaciones(t))).toBe(t);
  });
});

describe('validarEquipo', () => {
  const ok = { nombre: 'X', slug: 'x-1', categoria: 'pesca', marca: 'furuno', imagenUrl: '' };
  it('acepta un equipo correcto', () => { expect(validarEquipo(ok)).toEqual({}); });
  it('detecta faltantes e identificador inválido', () => {
    const e = validarEquipo({ ...ok, nombre: ' ', slug: 'Mal Slug', categoria: '', marca: '' });
    expect(Object.keys(e).sort()).toEqual(['categoria', 'marca', 'nombre', 'slug']);
  });
  it('solo admite imágenes del sitio o https', () => {
    expect(validarEquipo({ ...ok, imagenUrl: '/productos/x/01.webp' })).toEqual({});
    expect(validarEquipo({ ...ok, imagenUrl: 'http://x.cl/a.png' }).imagenUrl).toBeTruthy();
    expect(validarEquipo({ ...ok, imagenUrl: 'javascript:alert(1)' }).imagenUrl).toBeTruthy();
  });
});
