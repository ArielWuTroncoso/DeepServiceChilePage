import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIdioma } from '../../i18n/IdiomaContext';

export default function PageHeader({ eyebrow, titulo, descripcion, migas = [] }) {
  const { t } = useIdioma();
  return (
    <section className="pagehead ds-dark">
      <span className="ds-grid-tex" aria-hidden="true" />
      <div className="ds-container">
        <div className="pagehead__inner">
          {migas.length > 0 && (
            <nav className="pagehead__crumbs" aria-label={t('Ruta de navegación', 'Breadcrumb')}>
              <Link to="/">{t('Inicio', 'Home')}</Link>
              {migas.map((m) => (
                <span key={m.label} style={{ display: 'contents' }}>
                  <ChevronRight size={14} aria-hidden="true" />
                  {m.to ? <Link to={m.to}>{m.label}</Link> : <span aria-current="page">{m.label}</span>}
                </span>
              ))}
            </nav>
          )}
          {eyebrow && <span className="ds-tag ds-tag--ghost">{eyebrow}</span>}
          <h1 className="ds-display ds-h1">{titulo}</h1>
          {descripcion && <p>{descripcion}</p>}
        </div>
      </div>
    </section>
  );
}
