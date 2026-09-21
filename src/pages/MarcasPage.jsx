import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import SectionHead from '../components/common/SectionHead';
import MarcaSlot from '../components/common/MarcaSlot';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { MARCAS, PRODUCTOS } from '../data/catalogo';

export default function MarcasPage() {
  useDocumentTitle('Marcas', 'Marcas de electrónica marina representadas por Deep Service Chile.');

  return (
    <>
      <PageHeader
        eyebrow="Representaciones"
        titulo="Marcas que trabajamos"
        descripcion="Equipamiento de fabricantes con respaldo de fábrica, repuestos disponibles y soporte técnico local."
        migas={[{ label: 'Marcas' }]}
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
                      Ver {total} {total === 1 ? 'equipo' : 'equipos'} <ArrowRight size={15} />
                    </Link>
                  ) : (
                    <Link to="/contacto" className="pillar__more">
                      Consultar por esta marca <ArrowRight size={15} />
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
            barra="¿Buscas otra marca?"
            titulo="También conseguimos equipos por encargo"
            descripcion="Si el equipo que necesitas no está en el catálogo, cuéntanos qué buscas. Trabajamos con proveedores que cubren gran parte del mercado de electrónica marina."
          />
          <Link to="/contacto" className="ds-btn ds-btn--primary">Consultar por un equipo</Link>
        </div>
      </section>
    </>
  );
}
