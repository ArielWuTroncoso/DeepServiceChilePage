import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import AuthVisual from '../components/layout/AuthVisual';
import FieldError from '../components/common/FieldError';
import CampoClave from '../components/auth/CampoClave';
import ReglasClave from '../components/auth/ReglasClave';
import { useAuth } from '../context/useAuth';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useIdioma } from '../i18n/IdiomaContext';
import { mensajeError } from '../i18n/errores';
import { claveValida } from '../utils/clave';

const MARCA_REGISTRADO = 'deepservice:admin-registrado';
const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VACIO = { nombre: '', correo: '', contrasena: '', confirmar: '', codigo: '' };

const yaSeRegistro = () => {
  try { return localStorage.getItem(MARCA_REGISTRADO) === '1'; } catch { return false; }
};
const recordarRegistro = () => {
  try { localStorage.setItem(MARCA_REGISTRADO, '1'); } catch { /* ignorar */ }
};

/**
 * Acceso de administradores. Se llega con la secuencia ↑ ↓ del teclado.
 * Un administrador nuevo se registra primero (correo, contraseña y código de
 * autorización); quien ya tiene cuenta usa la pestaña "Ingresar".
 */
export default function AccesoPage() {
  const { t, idioma } = useIdioma();
  const { iniciarSesion, registrarAdmin, autenticado, esAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Quien nunca se ha registrado en este equipo empieza por el registro.
  const [modo, setModo] = useState(() => (yaSeRegistro() ? 'ingreso' : 'registro'));
  const [datos, setDatos] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const registro = modo === 'registro';
  useDocumentTitle(registro ? t('Registro de administrador', 'Administrator sign-up') : t('Ingreso de administrador', 'Administrator sign-in'));

  if (autenticado) return <Navigate to={location.state?.desde ?? (esAdmin ? '/admin' : '/')} replace />;

  const cambiarModo = (nuevo) => {
    setModo(nuevo);
    setErrores({});
    setError('');
    setDatos((d) => ({ ...VACIO, correo: d.correo }));
  };

  const cambiar = (e) => {
    const { name, value } = e.target;
    setDatos((d) => ({ ...d, [name]: value }));
    if (errores[name]) setErrores((x) => ({ ...x, [name]: null }));
  };

  const validar = () => {
    const e = {};
    if (registro && !datos.nombre.trim()) e.nombre = t('Ingresa tu nombre.', 'Enter your name.');
    if (!datos.correo.trim()) e.correo = t('Ingresa tu correo.', 'Enter your email.');
    else if (!CORREO_VALIDO.test(datos.correo.trim())) e.correo = t('Revisa el formato del correo.', 'Please check the email format.');

    if (!datos.contrasena) {
      e.contrasena = registro ? t('Define una contraseña.', 'Choose a password.') : t('Ingresa tu contraseña.', 'Enter your password.');
    } else if (registro && !claveValida(datos.contrasena)) {
      e.contrasena = t('La contraseña no cumple todas las condiciones.', 'The password does not meet all the requirements.');
    }
    if (registro) {
      if (datos.confirmar !== datos.contrasena) e.confirmar = t('Las contraseñas no coinciden.', 'Passwords do not match.');
      if (!datos.codigo.trim()) e.codigo = t('Ingresa el código de autorización.', 'Enter the authorization code.');
    }
    return e;
  };

  const mensaje = (err) => {
    if (registro && err?.status === 403 && idioma === 'en') {
      return 'The authorization code is not valid, or administrator sign-up is not enabled.';
    }
    return mensajeError(err, idioma);
  };

  const enviar = async (ev) => {
    ev.preventDefault();
    setError('');
    const e = validar();
    setErrores(e);
    if (Object.keys(e).length) return;

    setEnviando(true);
    try {
      if (registro) {
        await registrarAdmin({
          nombre: datos.nombre.trim(),
          correo: datos.correo.trim(),
          contrasena: datos.contrasena,
          codigo: datos.codigo.trim(),
        });
      } else {
        await iniciarSesion(datos.correo.trim(), datos.contrasena);
      }
      recordarRegistro();
      navigate(location.state?.desde ?? '/admin', { replace: true });
    } catch (err) {
      setError(mensaje(err));
    } finally {
      setEnviando(false);
    }
  };

  const idPestana = (m) => `tab-${m}`;

  return (
    <div className="auth">
      <AuthVisual
        titulo={t('Acceso de administradores', 'Administrator access')}
        texto={t(
          'Un espacio reservado para el equipo de Deep Service: aquí se gestionan las solicitudes que llegan desde el sitio y el catálogo publicado.',
          'A space reserved for the Deep Service team: this is where requests from the website and the published catalog are managed.',
        )}
        puntos={[
          t('Solicitudes de contacto en un solo lugar', 'Contact requests in one place'),
          t('Estado del catálogo publicado', 'Status of the published catalog'),
          t('Registro protegido con código de autorización', 'Sign-up protected by an authorization code'),
        ]}
      />

      <div className="auth__panel">
        <div className="auth__form">
          <div className="auth__tabs" role="tablist" aria-label={t('Tipo de acceso', 'Access type')}>
            {[['registro', t('Registrarme', 'Sign up')], ['ingreso', t('Ingresar', 'Sign in')]].map(([id, etiqueta]) => (
              <button
                key={id}
                id={idPestana(id)}
                type="button"
                role="tab"
                aria-selected={modo === id}
                aria-controls="panel-acceso"
                className={modo === id ? 'is-active' : ''}
                onClick={() => cambiarModo(id)}
              >
                {etiqueta}
              </button>
            ))}
          </div>

          <div id="panel-acceso" role="tabpanel" aria-labelledby={idPestana(modo)}>
            <h1 className="ds-display">
              {registro ? t('Registro de administrador', 'Administrator sign-up') : t('Ingreso de administrador', 'Administrator sign-in')}
            </h1>
            <p className="auth__lead">
              {registro
                ? t('Crea tu cuenta con tu correo y una contraseña segura. Al terminar entrarás directo a tu perfil.', 'Create your account with your email and a strong password. When you finish you will go straight to your profile.')
                : t('Ingresa con el correo y la contraseña de tu cuenta.', 'Sign in with your account email and password.')}
            </p>

            {error && <div className="ds-alert ds-alert--err" role="alert">{error}</div>}

            <form onSubmit={enviar} noValidate>
              {registro && (
                <div className={`field${errores.nombre ? ' field--err' : ''}`}>
                  <label htmlFor="nombre">{t('Nombre completo', 'Full name')}</label>
                  <input id="nombre" name="nombre" value={datos.nombre} onChange={cambiar}
                    autoComplete="name" aria-invalid={errores.nombre ? 'true' : undefined} aria-describedby={errores.nombre ? 'err-nombre' : undefined} />
                  <FieldError mensaje={errores.nombre} id="err-nombre" />
                </div>
              )}

              <div className={`field${errores.correo ? ' field--err' : ''}`}>
                <label htmlFor="correo">{t('Correo', 'Email')}</label>
                <input id="correo" name="correo" type="email" value={datos.correo} onChange={cambiar}
                  autoComplete="email" aria-invalid={errores.correo ? 'true' : undefined} aria-describedby={errores.correo ? 'err-correo' : undefined} />
                <FieldError mensaje={errores.correo} id="err-correo" />
              </div>

              <CampoClave
                id="contrasena"
                name="contrasena"
                label={t('Contraseña', 'Password')}
                value={datos.contrasena}
                onChange={cambiar}
                autoComplete={registro ? 'new-password' : 'current-password'}
                error={errores.contrasena}
                describedBy={registro ? 'reglas-clave' : undefined}
              >
                {registro && <ReglasClave clave={datos.contrasena} id="reglas-clave" />}
              </CampoClave>

              {registro && (
                <>
                  <CampoClave
                    id="confirmar"
                    name="confirmar"
                    label={t('Repetir contraseña', 'Confirm password')}
                    value={datos.confirmar}
                    onChange={cambiar}
                    autoComplete="new-password"
                    error={errores.confirmar}
                  />

                  <div className={`field${errores.codigo ? ' field--err' : ''}`}>
                    <label htmlFor="codigo">{t('Código de autorización', 'Authorization code')}</label>
                    <input id="codigo" name="codigo" type="password" value={datos.codigo} onChange={cambiar}
                      autoComplete="off" spellCheck="false"
                      aria-invalid={errores.codigo ? 'true' : undefined}
                      aria-describedby={errores.codigo ? 'err-codigo ayuda-codigo' : 'ayuda-codigo'} />
                    <FieldError mensaje={errores.codigo} id="err-codigo" />
                    <span className="field__hint" id="ayuda-codigo">
                      {t('Te lo entrega quien administra el sitio.', 'Provided by whoever manages the site.')}
                    </span>
                  </div>
                </>
              )}

              <button type="submit" className="ds-btn ds-btn--primary auth__submit" disabled={enviando}>
                {registro
                  ? (enviando ? t('Creando cuenta…', 'Creating account…') : t('Crear cuenta de administrador', 'Create administrator account'))
                  : (enviando ? t('Ingresando…', 'Signing in…') : t('Ingresar', 'Sign in'))}
              </button>
            </form>

            <p className="auth__alt">
              {registro ? t('¿Ya tienes cuenta?', 'Already have an account?') : t('¿Primera vez aquí?', 'First time here?')}{' '}
              <button type="button" className="auth__link" onClick={() => cambiarModo(registro ? 'ingreso' : 'registro')}>
                {registro ? t('Ingresa', 'Sign in') : t('Regístrate', 'Sign up')}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
