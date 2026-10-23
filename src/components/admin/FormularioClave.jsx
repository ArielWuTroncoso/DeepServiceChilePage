import { useState } from 'react';
import { Check } from 'lucide-react';
import CampoClave from '../auth/CampoClave';
import ReglasClave from '../auth/ReglasClave';
import { useAuth } from '../../context/useAuth';
import { useIdioma } from '../../i18n/IdiomaContext';
import { detallesError, mensajeError } from '../../i18n/errores';
import { claveValida } from '../../utils/clave';

const VACIO = { actual: '', nueva: '', repetir: '' };

/** Cambio de contraseña (en la pestaña "Mi cuenta" y en la ventana obligatoria de la clave inicial). */
export default function FormularioClave({ alTerminar, idPrefijo = 'cc' }) {
  const { cambiarClave } = useAuth();
  const { t, idioma } = useIdioma();
  const [campos, setCampos] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [aviso, setAviso] = useState({ tipo: null, texto: '', detalles: [] });
  const [enviando, setEnviando] = useState(false);

  const cambiar = (e) => {
    const { name, value } = e.target;
    setCampos((c) => ({ ...c, [name]: value }));
    if (errores[name]) setErrores((x) => ({ ...x, [name]: null }));
  };

  const validar = () => {
    const e = {};
    if (!campos.actual) e.actual = t('Escribe tu contraseña actual.', 'Enter your current password.');
    if (!claveValida(campos.nueva)) e.nueva = t('La contraseña nueva no cumple las condiciones.', 'The new password does not meet the requirements.');
    else if (campos.nueva === campos.actual) e.nueva = t('La contraseña nueva debe ser distinta de la actual.', 'The new password must differ from the current one.');
    if (campos.repetir !== campos.nueva) e.repetir = t('Las contraseñas no coinciden.', 'The passwords do not match.');
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const enviar = async (ev) => {
    ev.preventDefault();
    setAviso({ tipo: null, texto: '', detalles: [] });
    if (!validar()) return;
    setEnviando(true);
    try {
      await cambiarClave(campos.actual, campos.nueva);
      setCampos(VACIO);
      setAviso({ tipo: 'ok', texto: t('Contraseña actualizada. Las demás sesiones de tu cuenta se cerraron.', 'Password updated. Your other sessions were signed out.'), detalles: [] });
      alTerminar?.();
    } catch (err) {
      setAviso({ tipo: 'err', texto: mensajeError(err, idioma, { contexto: 'panel' }), detalles: detallesError(err, idioma) });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={enviar} noValidate>
      {aviso.tipo && (
        <div className={`ds-alert ds-alert--${aviso.tipo}`} role={aviso.tipo === 'err' ? 'alert' : 'status'}>
          {aviso.texto}
          {aviso.detalles.length > 0 && <ul className="ds-alert__lista">{aviso.detalles.map((d) => <li key={d}>{d}</li>)}</ul>}
        </div>
      )}
      <CampoClave id={`${idPrefijo}-actual`} name="actual" label={t('Contraseña actual', 'Current password')}
        value={campos.actual} onChange={cambiar} autoComplete="current-password" error={errores.actual} />
      <CampoClave id={`${idPrefijo}-nueva`} name="nueva" label={t('Contraseña nueva', 'New password')}
        value={campos.nueva} onChange={cambiar} autoComplete="new-password" error={errores.nueva}
        describedBy={`${idPrefijo}-reglas`}>
        <ReglasClave clave={campos.nueva} id={`${idPrefijo}-reglas`} />
      </CampoClave>
      <CampoClave id={`${idPrefijo}-repetir`} name="repetir" label={t('Repite la contraseña nueva', 'Repeat the new password')}
        value={campos.repetir} onChange={cambiar} autoComplete="new-password" error={errores.repetir} />
      <button type="submit" className="ds-btn ds-btn--primary" disabled={enviando}>
        {enviando ? t('Guardando…', 'Saving…') : <>{t('Cambiar contraseña', 'Change password')} <Check size={17} /></>}
      </button>
    </form>
  );
}
