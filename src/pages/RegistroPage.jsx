import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthVisual from '../components/layout/AuthVisual';
import FieldError from '../components/common/FieldError';
import { registrar } from '../services/authService';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const VACIO = { nombre: '', correo: '', telefono: '', empresa: '', contrasena: '', confirmar: '' };

export default function RegistroPage() {
  useDocumentTitle('Solicitar acceso');
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
    if (!datos.nombre.trim()) e.nombre = 'Ingresa tu nombre.';
    if (!datos.correo.trim()) e.correo = 'Ingresa tu correo.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo)) e.correo = 'Revisa el formato del correo.';
    if (!datos.contrasena) e.contrasena = 'Define una contraseña.';
    else if (datos.contrasena.length < 8) e.contrasena = 'Debe tener al menos 8 caracteres.';
    if (datos.confirmar !== datos.contrasena) e.confirmar = 'Las contraseñas no coinciden.';
    setErrores(e);
    if (Object.keys(e).length) return;

    setEnviando(true);
    try {
      const { confirmar, ...payload } = datos;
      await registrar(payload);
      navigate('/login', { replace: true, state: { registrado: true } });
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="auth">
      <AuthVisual
        titulo="Solicita tu acceso"
        texto="Crea una cuenta para hacer seguimiento a tus cotizaciones y solicitudes de servicio técnico."
        puntos={['Cotizaciones en un solo lugar', 'Historial por embarcación', 'Contacto directo con tu ejecutivo']}
      />

      <div className="auth__panel">
        <div className="auth__form">
          <h1 className="ds-display">Crear cuenta</h1>
          <p>Completa tus datos y validaremos el acceso.</p>

          {error && <div className="ds-alert ds-alert--err" role="alert">{error}</div>}

          <form onSubmit={enviar} noValidate>
            <div className={`field${errores.nombre ? ' field--err' : ''}`}>
              <label htmlFor="nombre">Nombre completo</label>
              <input id="nombre" name="nombre" value={datos.nombre} onChange={cambiar} autoComplete="name" />
              <FieldError mensaje={errores.nombre} />
            </div>

            <div className={`field${errores.correo ? ' field--err' : ''}`}>
              <label htmlFor="correo">Correo</label>
              <input id="correo" name="correo" type="email" value={datos.correo} onChange={cambiar} autoComplete="email" />
              <FieldError mensaje={errores.correo} />
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="telefono">Teléfono</label>
                <input id="telefono" name="telefono" type="tel" value={datos.telefono} onChange={cambiar} autoComplete="tel" />
              </div>
              <div className="field">
                <label htmlFor="empresa">Empresa</label>
                <input id="empresa" name="empresa" value={datos.empresa} onChange={cambiar} autoComplete="organization" />
              </div>
            </div>

            <div className={`field${errores.contrasena ? ' field--err' : ''}`}>
              <label htmlFor="contrasena">Contraseña</label>
              <input id="contrasena" name="contrasena" type="password" value={datos.contrasena}
                onChange={cambiar} autoComplete="new-password" />
              <FieldError mensaje={errores.contrasena} />
              <span className="field__hint">Mínimo 8 caracteres.</span>
            </div>

            <div className={`field${errores.confirmar ? ' field--err' : ''}`}>
              <label htmlFor="confirmar">Repetir contraseña</label>
              <input id="confirmar" name="confirmar" type="password" value={datos.confirmar}
                onChange={cambiar} autoComplete="new-password" />
              <FieldError mensaje={errores.confirmar} />
            </div>

            <button type="submit" className="ds-btn ds-btn--primary auth__submit" disabled={enviando}>
              {enviando ? 'Creando cuenta…' : 'Crear cuenta'}
            </button>
          </form>

          <p className="auth__alt">¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
        </div>
      </div>
    </div>
  );
}
