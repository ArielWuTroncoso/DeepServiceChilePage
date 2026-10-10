import { useEffect, useRef, useState } from 'react';
import { Inbox, Package, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { useIdioma } from '../../i18n/IdiomaContext';

/**
 * Ventana de bienvenida al perfil. Aparece al entrar por primera vez al panel
 * y no vuelve a mostrarse una vez cerrada (el backend guarda que ya se vio).
 */
export default function BienvenidaPerfil() {
  const { usuario, marcarBienvenida } = useAuth();
  const { t, idioma } = useIdioma();
  const [cerrada, setCerrada] = useState(false);
  const botonRef = useRef(null);

  const visible = Boolean(usuario) && usuario.bienvenidaVista === false && !cerrada;

  const cerrar = () => {
    setCerrada(true);
    marcarBienvenida().catch(() => { /* si falla, se mostrará de nuevo en el próximo ingreso */ });
  };

  useEffect(() => {
    if (!visible) return undefined;
    botonRef.current?.focus();
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const alTeclear = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); cerrar(); }
      // Hay un único elemento enfocable: el foco no debe escapar del diálogo.
      if (e.key === 'Tab') { e.preventDefault(); botonRef.current?.focus(); }
    };
    document.addEventListener('keydown', alTeclear);
    return () => {
      document.body.style.overflow = overflowPrevio;
      document.removeEventListener('keydown', alTeclear);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!visible) return null;

  const primerNombre = usuario.nombre?.trim().split(/\s+/)[0] ?? '';
  const alta = usuario.fechaCreacion
    ? new Date(usuario.fechaCreacion).toLocaleDateString(idioma === 'en' ? 'en-US' : 'es-CL', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';

  return (
    <div className="modal" role="presentation">
      <div className="modal__card" role="dialog" aria-modal="true" aria-labelledby="bienvenida-titulo" aria-describedby="bienvenida-texto">
        <span className="modal__icon" aria-hidden="true"><ShieldCheck size={28} /></span>
        <span className="ds-tag">{t('Perfil de administrador', 'Administrator profile')}</span>
        <h2 id="bienvenida-titulo" className="ds-display">
          {t('Te damos la bienvenida', 'Welcome aboard')}{primerNombre && `, ${primerNombre}`}
        </h2>
        <p id="bienvenida-texto">
          {t('Tu cuenta de administrador está lista. Este es tu perfil:', 'Your administrator account is ready. This is your profile:')}
        </p>

        <dl className="modal__perfil">
          <div><dt>{t('Nombre', 'Name')}</dt><dd>{usuario.nombre}</dd></div>
          <div><dt>{t('Correo', 'Email')}</dt><dd>{usuario.correo}</dd></div>
          <div><dt>{t('Rol', 'Role')}</dt><dd>{t('Administrador', 'Administrator')}</dd></div>
          <div><dt>{t('Cuenta creada', 'Account created')}</dt><dd>{alta}</dd></div>
        </dl>

        <ul className="modal__lista">
          <li><Inbox size={18} aria-hidden="true" />{t('Revisa y marca como atendidas las solicitudes de contacto.', 'Review contact requests and mark them as handled.')}</li>
          <li><Package size={18} aria-hidden="true" />{t('Consulta el estado del catálogo publicado.', 'Check the status of the published catalog.')}</li>
        </ul>

        <p className="modal__nota">
          {t('Recuerda cerrar sesión al terminar, sobre todo en equipos compartidos.', 'Remember to sign out when you finish, especially on shared computers.')}
        </p>

        <button ref={botonRef} type="button" className="ds-btn ds-btn--primary modal__cta" onClick={cerrar}>
          {t('Entrar al panel', 'Go to the panel')}
        </button>
      </div>
    </div>
  );
}
