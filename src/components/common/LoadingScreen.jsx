import { useIdioma } from '../../i18n/IdiomaContext';

export default function LoadingScreen({ mensaje }) {
  const { t } = useIdioma();
  return (
    <div className="ds-loading" role="status" aria-live="polite">
      <span className="ds-spinner" aria-hidden="true" />
      <p>{mensaje ?? t('Cargando', 'Loading')}…</p>
    </div>
  );
}
