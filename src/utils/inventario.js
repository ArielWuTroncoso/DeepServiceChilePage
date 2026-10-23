/**
 * Lógica pura del panel (sin React): buscador en cascada, estado del stock y apoyo
 * al formulario de equipos. Vive aparte para poder probarla sin abrir el navegador.
 */

/** Minúsculas y sin tildes: "Plóter" y "ploter" se buscan igual. */
export function normalizar(texto = '') {
  return String(texto).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

/** 'sin' = agotado, 'bajo' = en o bajo el mínimo definido, 'ok' = normal. */
export function estadoStock(item) {
  if (item.stock <= 0) return 'sin';
  if (item.stockMinimo > 0 && item.stock <= item.stockMinimo) return 'bajo';
  return 'ok';
}

const contar = (lista, clave) => {
  const m = new Map();
  lista.forEach((i) => m.set(i[clave], (m.get(i[clave]) ?? 0) + 1));
  return m;
};

/**
 * Opciones de la búsqueda en cascada. Cada lista solo ofrece lo que existe dado lo ya elegido:
 *   categoría → marcas con equipos en esa categoría → equipos de esa categoría y marca.
 * Devuelve { categorias, marcas, equipos }, cada opción como { valor, etiqueta, total }.
 */
export function opcionesCascada(items, { categoria = '', marca = '' } = {}, nombres = {}) {
  const nombreCat = (s) => nombres.categoria?.(s) ?? s;
  const nombreMar = (s) => nombres.marca?.(s) ?? s;
  const orden = (a, b) => a.etiqueta.localeCompare(b.etiqueta, 'es');

  const porCategoria = contar(items, 'categoria');
  const categorias = [...porCategoria].map(([valor, total]) => ({ valor, etiqueta: nombreCat(valor), total })).sort(orden);

  const deCategoria = categoria ? items.filter((i) => i.categoria === categoria) : items;
  const porMarca = contar(deCategoria, 'marca');
  const marcas = [...porMarca].map(([valor, total]) => ({ valor, etiqueta: nombreMar(valor), total })).sort(orden);

  const deMarca = marca ? deCategoria.filter((i) => i.marca === marca) : deCategoria;
  const equipos = deMarca
    .map((i) => ({ valor: String(i.productoId), etiqueta: i.nombre, total: 1 }))
    .sort(orden);

  return { categorias, marcas, equipos };
}

/**
 * Si cambia una selección de arriba, las de abajo que dejaron de existir se limpian.
 * Devuelve la selección ya corregida.
 */
export function ajustarSeleccion(items, seleccion) {
  const { categoria, marca, producto } = seleccion;
  let m = marca;
  let p = producto;
  const deCategoria = categoria ? items.filter((i) => i.categoria === categoria) : items;
  if (m && !deCategoria.some((i) => i.marca === m)) m = '';
  const deMarca = m ? deCategoria.filter((i) => i.marca === m) : deCategoria;
  if (p && !deMarca.some((i) => String(i.productoId) === p)) p = '';
  return { ...seleccion, marca: m, producto: p };
}

/** Aplica cascada + texto libre + filtros rápidos sobre la lista de inventario. */
export function filtrarInventario(items, { categoria = '', marca = '', producto = '', texto = '', soloBajo = false, ocultarInactivos = false } = {}) {
  const q = normalizar(texto);
  return items.filter((i) => {
    if (categoria && i.categoria !== categoria) return false;
    if (marca && i.marca !== marca) return false;
    if (producto && String(i.productoId) !== producto) return false;
    if (ocultarInactivos && !i.activo) return false;
    if (soloBajo && estadoStock(i) === 'ok') return false;
    if (q) {
      const pajar = normalizar(`${i.nombre} ${i.subcategoria ?? ''} ${i.slug} ${i.marca} ${i.categoria}`);
      if (!pajar.includes(q)) return false;
    }
    return true;
  });
}

/** Totales para las tarjetas del resumen. */
export function resumenInventario(items) {
  return items.reduce((acc, i) => {
    const e = estadoStock(i);
    acc.equipos += 1;
    acc.unidades += i.stock;
    if (e === 'bajo') acc.bajo += 1;
    if (e === 'sin') acc.sin += 1;
    return acc;
  }, { equipos: 0, unidades: 0, bajo: 0, sin: 0 });
}

export const STOCK_MAXIMO = 1_000_000;

/**
 * Stock resultante de un movimiento, para mostrarlo antes de confirmar. null si no es válido:
 * cantidad vacía o con formato raro ("", "1e2", "1.5", "-1"), salida mayor al stock o total sobre el máximo.
 * Una cantidad vacía nunca vale 0 (un "fijar total" en blanco dejaría el stock en cero sin querer).
 */
export function stockResultante(stockActual, tipo, cantidad) {
  const texto = String(cantidad ?? '').trim();
  if (!/^\d{1,7}$/.test(texto)) return null;
  const n = Number(texto);
  let resultado = null;
  if (tipo === 'ENTRADA') resultado = stockActual + n;
  else if (tipo === 'SALIDA') resultado = n > stockActual ? null : stockActual - n;
  else if (tipo === 'AJUSTE') resultado = n;
  return resultado !== null && resultado > STOCK_MAXIMO ? null : resultado;
}

/** "Sonda FCV-800 (nueva)" → "sonda-fcv-800-nueva". Sin tildes ni símbolos. */
export function generarSlug(nombre = '') {
  return normalizar(nombre)
    .replace(/&/g, ' y ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 140);
}

/**
 * Especificaciones escritas una por línea como "Clave: valor". La clave termina en el
 * primer ':' (el valor puede llevar más). Las líneas vacías o sin ':' se ignoran.
 */
export function parsearEspecificaciones(texto = '') {
  return texto.split(/\r?\n/).reduce((lista, linea) => {
    const i = linea.indexOf(':');
    if (i < 1) return lista;
    const clave = linea.slice(0, i).trim();
    const valor = linea.slice(i + 1).trim();
    if (clave && valor) lista.push({ clave, valor, orden: lista.length });
    return lista;
  }, []);
}

export function especificacionesATexto(lista = []) {
  return lista.map((e) => `${e.clave}: ${e.valor}`).join('\n');
}

/** Mensajes de validación del formulario de equipos (vacío = sin errores). */
export function validarEquipo(f) {
  const e = {};
  if (!f.nombre.trim()) e.nombre = 'Escribe el nombre del equipo.';
  if (!f.slug.trim()) e.slug = 'Falta el identificador.';
  else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(f.slug)) e.slug = 'Solo minúsculas, números y guiones.';
  if (!f.categoria) e.categoria = 'Elige una categoría.';
  if (!f.marca) e.marca = 'Elige una marca.';
  if (f.imagenUrl && !/^(\/|https:\/\/)[^\s<>"']*$/.test(f.imagenUrl)) {
    e.imagenUrl = 'Usa una ruta del sitio (/productos/...) o una dirección https.';
  }
  return e;
}
