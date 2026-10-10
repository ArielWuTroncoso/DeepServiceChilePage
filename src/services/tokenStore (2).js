const KEY = 'deepservice:token';
const USER_KEY = 'deepservice:usuario';

export function getToken() {
  try { return localStorage.getItem(KEY); } catch { return null; }
}
export function setToken(token) {
  try { localStorage.setItem(KEY, token); } catch { /* ignorar */ }
}
export function clearToken() {
  try { localStorage.removeItem(KEY); localStorage.removeItem(USER_KEY); } catch { /* ignorar */ }
}
export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
export function setStoredUser(usuario) {
  try { localStorage.setItem(USER_KEY, JSON.stringify(usuario)); } catch { /* ignorar */ }
}
