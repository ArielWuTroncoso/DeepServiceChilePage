import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import AuthVisual from '../components/layout/AuthVisual';
import FieldError from '../components/common/FieldError';
import { useAuth } from '../context/useAuth';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useIdioma } from '../i18n/IdiomaContext';
import { mensajeError } from '../i18n/errores';

export default function LoginPage() {
  const { t, idioma } = useIdioma();
  useDocumentTitle(t('Iniciar sesión', 'Sign in'));
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
    if (!datos.correo.trim()) e.correo = t('Ingresa tu correo.', 'Enter your email.');
    if (!datos.contrasena) e.contrasena = t('Ingresa tu contraseña.', 'Enter your password.');
    setErrores(e);
    if (Object.keys(e).length) return;

    setEnviando(true);
    try {
      await iniciarSesion(datos.correo.trim(), datos.contrasena);
      navigate(location.state?.desde ?? '/', { replace: true });
    } catch (err) {
      setError(mensajeError(err, idioma));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="auth">
      <AuthVisual
        titulo={t('Área de clientes', 'Customer area')}
        texto={t(
          'Accede al seguimiento de tus cotizaciones, el historial de equipos instalados y las solicitudes de servicio técnico.',
          'Track your quotes, your installed equipment history and your technical service requests.',
        )}
        puntos={[
          t('Historial de equipos y mantenciones', 'Equipment and maintenance history'),
          t('Seguimiento de cotizaciones', 'Quote tracking'),
          t('Solicitudes de servicio técnico', 'Technical service requests'),
        ]}
      />

      <div className="auth__panel">
        <div className="auth__form">
          <h1 className="ds-display">{t('Iniciar sesión', 'Sign in')}</h1>
          <p>{t('Ingresa con las credenciales que te entregamos.', 'Sign in with the credentials we provided.')}</p>

          {error && <div className="ds-alert ds-alert--err" role="alert">{error}</div>}

          <form onSubmit={enviar} noValidate>
            <div className={`field${errores.correo ? ' field--err' : ''}`}>
              <label htmlFor="correo">{t('Correo', 'Email')}</label>
              <input id="correo" name="correo" type="email" value={datos.correo}
                onChange={cambiar} autoComplete="email" aria-describedby="err-correo" />
              <FieldError mensaje={errores.correo} id="err-correo" />
            </div>

            <div className={`field${errores.contrasena ? ' field--err' : ''}`}>
              <label htmlFor="contrasena">{t('Contraseña', 'Password')}</label>
              <input id="contrasena" name="contrasena" type="password" value={datos.contrasena}
                onChange={cambiar} autoComplete="current-password" aria-describedby="err-pass" />
              <FieldError mensaje={errores.contrasena} id="err-pass" />
            </div>

            <button type="submit" className="ds-btn ds-btn--primary auth__submit" disabled={enviando}>
              {enviando ? t('Ingresando…', 'Signing in…') : t('Ingresar', 'Sign in')}
            </button>
          </form>

          <p className="auth__alt">
            {t('¿No tienes cuenta?', 'Don’t have an account?')} <Link to="/registro">{t('Solicita acceso', 'Request access')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
