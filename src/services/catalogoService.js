import { api } from './apiClient';

export const listarCategorias = () => api.get('/api/categorias');
export const listarMarcas = () => api.get('/api/marcas');

export function listarProductos({ categoria, marca, busqueda } = {}) {
  const qs = new URLSearchParams();
  if (categoria) qs.set('categoria', categoria);
  if (marca) qs.set('marca', marca);
  if (busqueda) qs.set('q', busqueda);
  const cola = qs.toString();
  return api.get(`/api/productos${cola ? `?${cola}` : ''}`);
}

export const obtenerProducto = (slug) => api.get(`/api/productos/${slug}`);

/** Equipos activos y equipos dados de baja desde el panel (no incluye existencias). */
export const estadoCatalogo = () => api.get('/api/catalogo/estado');
