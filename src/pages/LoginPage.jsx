import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import AuthVisual from '../components/layout/AuthVisual';
import FieldError from '../components/common/FieldError';
import { useAuth } from '../context/useAuth';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function LoginPage() {
  useDocumentTitle('Iniciar sesión');
  const { iniciarSesion, autenticado } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [datos, setDatos] = useState({ correo: '', contrasena: '' });
  const [errores, setErrores] = useState({});
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (autenticado) return <Navigate to={location.state?.desde ?? '/'} replace />;

  const cambiar = (e) => {
    const { name, value } = e.target;
    setDatos((d) => ({ ...d, [name]: value }));
    if (errores[name]) setErrores((x) => ({ ...x, [name]: null }));
  };

  const enviar = async (ev) => {
    ev.preventDefault();
    setError('');
    const e = {};
    if (!datos.correo.trim()) e.correo = 'Ingresa tu correo.';
    if (!datos.contrasena) e.contrasena = 'Ingresa tu contraseña.';
    setErrores(e);
    if (Object.keys(e).length) return;

    setEnviando(true);
    try {
      await iniciarSesion(datos.correo.trim(), datos.contrasena);
      navigate(location.state?.desde ?? '/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="auth">
      <AuthVisual
        titulo="Área de clientes"
        texto="Accede al seguimiento de tus cotizaciones, el historial de equipos instalados y las solicitudes de servicio técnico."
        puntos={[
          'Historial de equipos y mantenciones',
          'Seguimiento de cotizaciones',
          'Solicitudes de servicio técnico',
        ]}
      />

      <div className="auth__panel">
        <div className="auth__form">
          <h1 className="ds-display">Iniciar sesión</h1>
          <p>Ingresa con las credenciales que te entregamos.</p>

          {error && <div className="ds-alert ds-alert--err" role="alert">{error}</div>}

          <form onSubmit={enviar} noValidate>
            <div className={`field${errores.correo ? ' field--err' : ''}`}>
              <label htmlFor="correo">Correo</label>
              <input id="correo" name="correo" type="email" value={datos.correo}
                onChange={cambiar} autoComplete="email" aria-describedby="err-correo" />
              <FieldError mensaje={errores.correo} id="err-correo" />
            </div>

            <div className={`field${errores.contrasena ? ' field--err' : ''}`}>
              <label htmlFor="contrasena">Contraseña</label>
              <input id="contrasena" name="contrasena" type="password" value={datos.contrasena}
                onChange={cambiar} autoComplete="current-password" aria-describedby="err-pass" />
              <FieldError mensaje={errores.contrasena} id="err-pass" />
            </div>

            <button type="submit" className="ds-btn ds-btn--primary auth__submit" disabled={enviando}>
              {enviando ? 'Ingresando…' : 'Ingresar'}
            </button>
          </form>

          <p className="auth__alt">
            ¿No tienes cuenta? <Link to="/registro">Solicita acceso</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
