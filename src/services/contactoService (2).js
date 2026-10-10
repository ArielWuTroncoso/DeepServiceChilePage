import { api } from './apiClient';

export const enviarSolicitud = (datos) => api.post('/api/contacto', datos);
export const listarSolicitudes = () => api.get('/api/contacto');
export const marcarAtendida = (id) => api.put(`/api/contacto/${id}/atender`, {});
