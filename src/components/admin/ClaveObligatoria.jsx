import { KeyRound } from 'lucide-react';
import Modal from './Modal';
import FormularioClave from './FormularioClave';
import { useAuth } from '../../context/useAuth';
import { useIdioma } from '../../i18n/IdiomaContext';

/**
 * La cuenta sigue con la contraseña que estuvo publicada en la primera versión del sitio.
 * Mientras no se cambie no se puede usar el panel: la ventana no se puede cerrar.
 */
export default function ClaveObligatoria() {
  const { usuario } = useAuth();
  const { t } = useIdioma();
  if (!usuario?.claveInicial) return null;

  return (
    <Modal bloqueado idTitulo="clave-obligatoria-titulo" titulo={(
      <>
        <span className="modal__icon" aria-hidden="true"><KeyRound size={28} /></span>
        <h2 id="clave-obligatoria-titulo" className="ds-display">{t('Cambia tu contraseña', 'Change your password')}</h2>
        <p>
          {t(
            'Esta cuenta todavía usa la contraseña inicial, que estuvo escrita en la documentación del proyecto y por eso no es segura. Elige una nueva para seguir usando el panel.',
            'This account still uses the initial password, which was written in the project documentation and is therefore not secure. Choose a new one to keep using the panel.',
          )}
        </p>
      </>
    )}>
      <FormularioClave idPrefijo="obl" />
    </Modal>
  );
}
