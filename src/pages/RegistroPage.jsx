import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthVisual from '../components/layout/AuthVisual';
import FieldError from '../components/common/FieldError';
import { registrar } from '../services/authService';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useIdioma } from '../i18n/IdiomaContext';
import { mensajeError } from '../i18n/errores';

const VACIO = { nombre: '', correo: '', telefono: '', empresa: '', contrasena: '', confirmar: '' };

export default function RegistroPage() {
  const { t, idioma } = useIdioma();
  useDocumentTitle(t('Solicitar acceso', 'Request access'));
  const navigate = useNavigate();

  const [datos, setDatos] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const cambiar = (e) => {
    const { name, value } = e.target;
    setDatos((d) => ({ ...d, [name]: value }));
    if (errores[name]) setErrores((x) => ({ ...x, [name]: null }));
  };

  const enviar = async (ev) => {
    ev.preventDefault();
    setError('');
    const e = {};
    if (!datos.nombre.trim()) e.nombre = t('Ingresa tu nombre.', 'Enter your name.');
    if (!datos.correo.trim()) e.correo = t('Ingresa tu correo.', 'Enter your email.');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo)) e.correo = t('Revisa el formato del correo.', 'Please check the email format.');
    if (!datos.contrasena) e.contrasena = t('Define una contraseña.', 'Choose a password.');
    else if (datos.contrasena.length < 8) e.contrasena = t('Debe tener al menos 8 caracteres.', 'It must be at least 8 characters long.');
    if (datos.confirmar !== datos.contrasena) e.confirmar = t('Las contraseñas no coinciden.', 'Passwords do not match.');
    setErrores(e);
    if (Object.keys(e).length) return;

    setEnviando(true);
    try {
      const { confirmar, ...payload } = datos;
      await registrar(payload);
      navigate('/login', { replace: true, state: { registrado: true } });
    } catch (err) {
      setError(mensajeError(err, idioma));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="auth">
      <AuthVisual
        titulo={t('Solicita tu acceso', 'Request your access')}
        texto={t(
          'Crea una cuenta para hacer seguimiento a tus cotizaciones y solicitudes de servicio técnico.',
          'Create an account to track your quotes and technical service requests.',
        )}
        puntos={[
          t('Cotizaciones en un solo lugar', 'All your quotes in one place'),
          t('Historial por embarcación', 'History by vessel'),
          t('Contacto directo con tu ejecutivo', 'Direct contact with your sales rep'),
        ]}
      />

      <div className="auth__panel">
        <div className="auth__form">
          <h1 className="ds-display">{t('Crear cuenta', 'Create account')}</h1>
          <p>{t('Completa tus datos y validaremos el acceso.', 'Fill in your details and we will validate your access.')}</p>

          {error && <div className="ds-alert ds-alert--err" role="alert">{error}</div>}

          <form onSubmit={enviar} noValidate>
            <div className={`field${errores.nombre ? ' field--err' : ''}`}>
              <label htmlFor="nombre">{t('Nombre completo', 'Full name')}</label>
              <input id="nombre" name="nombre" value={datos.nombre} onChange={cambiar} autoComplete="name" />
              <FieldError mensaje={errores.nombre} />
            </div>

            <div className={`field${errores.correo ? ' field--err' : ''}`}>
              <label htmlFor="correo">{t('Correo', 'Email')}</label>
              <input id="correo" name="correo" type="email" value={datos.correo} onChange={cambiar} autoComplete="email" />
              <FieldError mensaje={errores.correo} />
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="telefono">{t('Teléfono', 'Phone')}</label>
                <input id="telefono" name="telefono" type="tel" value={datos.telefono} onChange={cambiar} autoComplete="tel" />
              </div>
              <div className="field">
                <label htmlFor="empresa">{t('Empresa', 'Company')}</label>
                <input id="empresa" name="empresa" value={datos.empresa} onChange={cambiar} autoComplete="organization" />
              </div>
            </div>

            <div className={`field${errores.contrasena ? ' field--err' : ''}`}>
              <label htmlFor="contrasena">{t('Contraseña', 'Password')}</label>
              <input id="contrasena" name="contrasena" type="password" value={datos.contrasena}
                onChange={cambiar} autoComplete="new-password" />
              <FieldError mensaje={errores.contrasena} />
              <span className="field__hint">{t('Mínimo 8 caracteres.', 'At least 8 characters.')}</span>
            </div>

            <div className={`field${errores.confirmar ? ' field--err' : ''}`}>
              <label htmlFor="confirmar">{t('Repetir contraseña', 'Confirm password')}</label>
              <input id="confirmar" name="confirmar" type="password" value={datos.confirmar}
                onChange={cambiar} autoComplete="new-password" />
              <FieldError mensaje={errores.confirmar} />
            </div>

            <button type="submit" className="ds-btn ds-btn--primary auth__submit" disabled={enviando}>
              {enviando ? t('Creando cuenta…', 'Creating account…') : t('Crear cuenta', 'Create account')}
            </button>
          </form>

          <p className="auth__alt">{t('¿Ya tienes cuenta?', 'Already have an account?')} <Link to="/login">{t('Inicia sesión', 'Sign in')}</Link></p>
        </div>
      </div>
    </div>
  );
}
