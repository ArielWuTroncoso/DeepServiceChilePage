import { api } from './apiClient';

/** Formulario público: solo permite enviar. Leer las solicitudes es del panel (adminService). */
export const enviarSolicitud = (datos) => api.post('/api/contacto', datos);
