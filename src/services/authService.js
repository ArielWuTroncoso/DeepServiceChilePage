import { api } from './apiClient';
import { clearToken, setStoredUser, setToken } from './tokenStore';

function guardarSesion(data) {
  if (data?.token) setToken(data.token);
  if (data?.usuario) setStoredUser(data.usuario);
  return data;
}

export async function login(correo, contrasena) {
  return guardarSesion(await api.post('/auth/login', { correo, contrasena }));
}

/** Alta de administrador (exige el código de autorización). Deja la sesión iniciada. */
export async function registrarAdmin(datos) {
  return guardarSesion(await api.post('/auth/admin/registro', datos));
}

export async function perfilActual() {
  return api.get('/auth/me');
}

/** Avisa al backend que la persona ya vio la ventana de bienvenida. */
export async function marcarBienvenidaVista() {
  const usuario = await api.post('/auth/me/bienvenida', {});
  if (usuario) setStoredUser(usuario);
  return usuario;
}

/** Cambia la contraseña. El servidor cierra las demás sesiones y entrega una nueva a esta. */
export async function cambiarContrasena(actual, nueva) {
  return guardarSesion(await api.put('/auth/me/contrasena', { actual, nueva }));
}

export function logout() {
  clearToken();
}
