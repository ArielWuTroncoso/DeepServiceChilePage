import { api } from './apiClient';

/**
 * Todo lo que vive bajo /api/admin: solicitudes de clientes, inventario y gestión del catálogo.
 * El servidor responde 401/403 a quien no tenga sesión de administrador.
 */

// ----- Solicitudes de clientes -----
export const listarSolicitudes = () => api.get('/api/admin/solicitudes');
export const marcarAtendida = (id) => api.put(`/api/admin/solicitudes/${id}/atender`, {});
export const reabrirSolicitud = (id) => api.put(`/api/admin/solicitudes/${id}/reabrir`, {});

// ----- Inventario -----
export const listarInventario = () => api.get('/api/admin/inventario');
export const registrarMovimiento = (productoId, { tipo, cantidad, motivo }) =>
  api.post(`/api/admin/inventario/${productoId}/movimientos`, { tipo, cantidad, motivo: motivo || null });
export const actualizarMinimo = (productoId, stockMinimo) =>
  api.put(`/api/admin/inventario/${productoId}/minimo`, { stockMinimo });
export const historialInventario = (productoId) => api.get(`/api/admin/inventario/${productoId}/movimientos`);

// ----- Catálogo -----
export const listarEquipos = () => api.get('/api/admin/productos');
export const crearEquipo = (datos) => api.post('/api/admin/productos', datos);
export const actualizarEquipo = (id, datos) => api.put(`/api/admin/productos/${id}`, datos);
export const cambiarActivoEquipo = (id, activo) => api.put(`/api/admin/productos/${id}/activo`, { activo });
