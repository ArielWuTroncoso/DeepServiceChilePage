import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import * as authService from '../services/authService';
import { getStoredUser, getToken } from '../services/tokenStore';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => getStoredUser());
  const [cargando, setCargando] = useState(() => Boolean(getToken()));

  // Revalida la sesión guardada contra el backend al montar.
  useEffect(() => {
    let vigente = true;
    if (!getToken()) { setCargando(false); return undefined; }

    authService.perfilActual()
      .then((datos) => { if (vigente) setUsuario(datos); })
      .catch(() => { if (vigente) { authService.logout(); setUsuario(null); } })
      .finally(() => { if (vigente) setCargando(false); });

    return () => { vigente = false; };
  }, []);

  // El apiClient avisa cuando el backend responde 401.
  useEffect(() => {
    const alExpirar = () => setUsuario(null);
    window.addEventListener('deepservice:unauthorized', alExpirar);
    return () => window.removeEventListener('deepservice:unauthorized', alExpirar);
  }, []);

  const iniciarSesion = useCallback(async (correo, contrasena) => {
    const data = await authService.login(correo, contrasena);
    setUsuario(data.usuario ?? null);
    return data;
  }, []);

  const registrarAdmin = useCallback(async (datos) => {
    const data = await authService.registrarAdmin(datos);
    setUsuario(data.usuario ?? null);
    return data;
  }, []);

  const marcarBienvenida = useCallback(async () => {
    const actualizado = await authService.marcarBienvenidaVista();
    if (actualizado) setUsuario(actualizado);
  }, []);

  const cerrarSesion = useCallback(() => {
    authService.logout();
    setUsuario(null);
  }, []);

  const value = useMemo(() => ({
    usuario,
    cargando,
    autenticado: Boolean(usuario),
    esAdmin: usuario?.roles?.includes('ADMIN') ?? false,
    iniciarSesion,
    registrarAdmin,
    marcarBienvenida,
    cerrarSesion,
  }), [usuario, cargando, iniciarSesion, registrarAdmin, marcarBienvenida, cerrarSesion]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
