import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function NotFoundPage() {
  useDocumentTitle('Página no encontrada');

  return (
    <section className="ds-section" style={{ minHeight: '60vh', display: 'grid', placeContent: 'center' }}>
      <div className="ds-container" style={{ textAlign: 'center', display: 'grid', gap: 18, justifyItems: 'center' }}>
        <span className="ds-badge" style={{ width: 76, height: 76, borderRadius: '50%' }} aria-hidden="true">
          <Compass size={34} />
        </span>
        <span className="ds-display" style={{ fontSize: '4.5rem', color: 'var(--b-500)', lineHeight: 1 }}>404</span>
        <h1 className="ds-display ds-h3">Rumbo no encontrado</h1>
        <p className="ds-lead" style={{ maxWidth: '46ch' }}>
          La página que buscas no existe o cambió de dirección.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/" className="ds-btn ds-btn--primary">Volver al inicio</Link>
          <Link to="/productos" className="ds-btn ds-btn--outline">Ver el catálogo</Link>
        </div>
      </div>
    </section>
  );
}
