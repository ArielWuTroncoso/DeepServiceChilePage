import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import SectionHead from '../components/common/SectionHead';
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
                  <div className="brand-slot" style={{ height: 120, borderStyle: 'solid' }}>
                    <strong>{m.nombre}</strong>
                    <span>{m.destacada ? 'Marca representada' : 'Logotipo pendiente'}</span>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.14rem', fontWeight: 800, marginBottom: 8 }}>{m.nombre}</h3>
                    <p style={{ color: 'var(--ink-soft)', lineHeight: 1.55, fontSize: '.95rem' }}>{m.desc}</p>
                  </div>
                  <Link to={`/productos?marca=${m.slug}`} className="pillar__more">
                    Ver {total} {total === 1 ? 'equipo' : 'equipos'} <ArrowRight size={15} />
                  </Link>
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
