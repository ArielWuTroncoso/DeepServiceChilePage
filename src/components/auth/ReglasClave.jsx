import { Check, Circle } from 'lucide-react';
import { evaluarClave } from '../../utils/clave';
import { useIdioma } from '../../i18n/IdiomaContext';

/** Lista en vivo de las condiciones que debe cumplir la contraseña. */
export default function ReglasClave({ clave, id }) {
  const { t, idioma } = useIdioma();
  const reglas = evaluarClave(clave);

  return (
    <ul className="pw-rules" id={id} aria-label={t('Condiciones de la contraseña', 'Password requirements')}>
      {reglas.map((r) => (
        <li key={r.id} className={r.cumple ? 'is-ok' : ''}>
          {r.cumple ? <Check size={15} strokeWidth={3} aria-hidden="true" /> : <Circle size={15} aria-hidden="true" />}
          <span>{r[idioma === 'en' ? 'en' : 'es']}</span>
          <span className="ds-sr-only">{r.cumple ? t(' — cumplida', ' — met') : t(' — pendiente', ' — pending')}</span>
        </li>
      ))}
    </ul>
  );
}
