import { api } from './apiClient';
import { clearToken, setStoredUser, setToken } from './tokenStore';

export async function login(correo, contrasena) {
  const data = await api.post('/auth/login', { correo, contrasena });
  if (data?.token) setToken(data.token);
  if (data?.usuario) setStoredUser(data.usuario);
  return data;
}

export async function registrar(datos) {
  return api.post('/usuarios', datos);
}

export async function perfilActual() {
  return api.get('/auth/me');
}

export function logout() {
  clearToken();
}
