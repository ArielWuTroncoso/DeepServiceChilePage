import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useIdioma } from '../i18n/IdiomaContext';

export default function NotFoundPage() {
  const { t } = useIdioma();
  useDocumentTitle(t('Página no encontrada', 'Page not found'));

  return (
    <section className="ds-section" style={{ minHeight: '60vh', display: 'grid', placeContent: 'center' }}>
      <div className="ds-container" style={{ textAlign: 'center', display: 'grid', gap: 18, justifyItems: 'center' }}>
        <span className="ds-badge" style={{ width: 76, height: 76, borderRadius: '50%' }} aria-hidden="true">
          <Compass size={34} />
        </span>
        <span className="ds-display" style={{ fontSize: '4.5rem', color: 'var(--b-500)', lineHeight: 1 }}>404</span>
        <h1 className="ds-display ds-h3">{t('Rumbo no encontrado', 'Course not found')}</h1>
        <p className="ds-lead" style={{ maxWidth: '46ch' }}>
          {t('La página que buscas no existe o cambió de dirección.', 'The page you are looking for does not exist or has moved.')}
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/" className="ds-btn ds-btn--primary">{t('Volver al inicio', 'Back to home')}</Link>
          <Link to="/productos" className="ds-btn ds-btn--outline">{t('Ver el catálogo', 'Browse the catalog')}</Link>
        </div>
      </div>
    </section>
  );
}
