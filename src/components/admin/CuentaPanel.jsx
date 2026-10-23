import { ShieldCheck } from 'lucide-react';
import FormularioClave from './FormularioClave';
import { useAuth } from '../../context/useAuth';
import { useIdioma } from '../../i18n/IdiomaContext';

/** Datos de la cuenta con sesión iniciada y cambio de contraseña. */
export default function CuentaPanel() {
  const { usuario } = useAuth();
  const { t, idioma } = useIdioma();
  if (!usuario) return null;
  const alta = usuario.fechaCreacion
    ? new Date(usuario.fechaCreacion).toLocaleDateString(idioma === 'en' ? 'en-US' : 'es-CL', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';

  return (
    <div className="adm-cuenta">
      <section className="ds-card adm-cuenta__bloque">
        <h2 className="ds-display ds-h3"><ShieldCheck size={22} aria-hidden="true" /> {t('Tu cuenta', 'Your account')}</h2>
        <dl className="modal__perfil">
          <div><dt>{t('Nombre', 'Name')}</dt><dd>{usuario.nombre}</dd></div>
          <div><dt>{t('Correo', 'Email')}</dt><dd>{usuario.correo}</dd></div>
          <div><dt>{t('Rol', 'Role')}</dt><dd>{t('Administrador', 'Administrator')}</dd></div>
          <div><dt>{t('Cuenta creada', 'Account created')}</dt><dd>{alta}</dd></div>
        </dl>
        <ul className="adm-consejos">
          <li>{t('Tu sesión se cierra sola tras 30 minutos sin actividad.', 'Your session signs out after 30 minutes of inactivity.')}</li>
          <li>{t('Al cambiar la contraseña se cierran las demás sesiones de esta cuenta.', 'Changing the password signs out your other sessions.')}</li>
          <li>{t('No compartas la contraseña ni el código de registro de administradores.', 'Do not share the password or the administrator registration code.')}</li>
        </ul>
      </section>
      <section className="ds-card adm-cuenta__bloque">
        <h2 className="ds-display ds-h3">{t('Cambiar contraseña', 'Change password')}</h2>
        <FormularioClave idPrefijo="cta" />
      </section>
    </div>
  );
}
