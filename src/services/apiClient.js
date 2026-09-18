import { clearToken, getToken } from './tokenStore';

const rawBaseUrl = import.meta.env.VITE_API_URL || '';
const API_BASE_URL = rawBaseUrl.replace(/\/$/, '');

export class ApiError extends Error {
  constructor(message, status = 0, payload = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

export async function apiRequest(path, options = {}) {
  const token = getToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Accept')) headers.set('Accept', 'application/json');
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiError('No fue posible conectar con el servidor. Verifica tu conexión o que el backend esté iniciado.');
  }

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json().catch(() => null)
    : await response.text().catch(() => '');

  if (!response.ok) {
    if (response.status === 401 && token) {
      clearToken();
      window.dispatchEvent(new Event('deepservice:unauthorized'));
    }
    let mensaje = payload?.mensaje || payload?.message || 'La solicitud no pudo completarse.';
    if (typeof mensaje === 'string' && /SQL|Exception|constraint|null/i.test(mensaje)) {
      mensaje = 'Ocurrió un error en el servidor. Intenta nuevamente en unos minutos.';
    }
    throw new ApiError(mensaje, response.status, payload);
  }

  return payload;
}

export const api = {
  get: (path) => apiRequest(path),
  post: (path, body) => apiRequest(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => apiRequest(path, { method: 'PUT', body: JSON.stringify(body) }),
  del: (path) => apiRequest(path, { method: 'DELETE' }),
};
