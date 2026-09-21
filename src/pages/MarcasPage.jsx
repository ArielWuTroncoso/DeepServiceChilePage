import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import SectionHead from '../components/common/SectionHead';
import MarcaSlot from '../components/common/MarcaSlot';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useIdioma } from '../i18n/IdiomaContext';
import { useCatalogo } from '../i18n/datos';

export default function MarcasPage() {
  const { t } = useIdioma();
  const { MARCAS, PRODUCTOS } = useCatalogo();
  useDocumentTitle(
    t('Marcas', 'Brands'),
    t('Marcas de electrónica marina representadas por Deep Service Chile.', 'Marine electronics brands represented by Deep Service Chile.'),
  );

  return (
    <>
      <PageHeader
        eyebrow={t('Representaciones', 'Brands')}
        titulo={t('Marcas que trabajamos', 'Brands we work with')}
        descripcion={t(
          'Equipamiento de fabricantes con respaldo de fábrica, repuestos disponibles y soporte técnico local.',
          'Equipment from manufacturers with factory backing, available spare parts and local technical support.',
        )}
        migas={[{ label: t('Marcas', 'Brands') }]}
      />

      <section className="ds-section">
        <div className="ds-container">
          <div className="ds-grid ds-grid--2">
            {MARCAS.map((m) => {
              const total = PRODUCTOS.filter((p) => p.marca === m.slug).length;
              return (
                <article className="ds-card ds-card--hover" key={m.slug} style={{ padding: 28, display: 'grid', gap: 16 }}>
                  <MarcaSlot marca={m} alto={140} />
                  <p style={{ color: 'var(--ink-soft)', lineHeight: 1.55, fontSize: '.95rem' }}>{m.desc}</p>
                  {total > 0 ? (
                    <Link to={`/productos?marca=${m.slug}`} className="pillar__more">
                      {t('Ver', 'View')} {total} {total === 1 ? t('equipo', 'item') : t('equipos', 'items')} <ArrowRight size={15} />
                    </Link>
                  ) : (
                    <Link to="/contacto" className="pillar__more">
                      {t('Consultar por esta marca', 'Ask about this brand')} <ArrowRight size={15} />
                    </Link>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="ds-section" style={{ background: 'var(--paper-2)' }}>
        <div className="ds-container">
          <SectionHead
            barra={t('¿Buscas otra marca?', 'Looking for another brand?')}
            titulo={t('También conseguimos equipos por encargo', 'We also source equipment to order')}
            descripcion={t(
              'Si el equipo que necesitas no está en el catálogo, cuéntanos qué buscas. Trabajamos con proveedores que cubren gran parte del mercado de electrónica marina.',
              'If the equipment you need is not in the catalog, tell us what you are looking for. We work with suppliers covering most of the marine electronics market.',
            )}
          />
          <Link to="/contacto" className="ds-btn ds-btn--primary">{t('Consultar por un equipo', 'Ask about equipment')}</Link>
        </div>
      </section>
    </>
  );
}
