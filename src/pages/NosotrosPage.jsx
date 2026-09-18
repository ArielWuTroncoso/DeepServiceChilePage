import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import SectionHead from '../components/common/SectionHead';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { HITOS } from '../data/empresa';

export default function NosotrosPage() {
  useDocumentTitle('Quiénes somos', 'Deep Service Chile: soluciones y respaldo técnico en equipos electrónicos marinos.');

  return (
    <>
      <PageHeader
        eyebrow="Quiénes somos"
        titulo="Respaldo técnico, no sólo venta"
        descripcion="Deep Service Chile entrega soluciones y respaldo técnico en equipos electrónicos marinos asociados a la navegación y la pesca."
        migas={[{ label: 'Nosotros' }]}
      />

      <section className="ds-section">
        <div className="ds-container">
          <div className="stat-band" style={{ marginBottom: 'clamp(40px, 6vw, 72px)' }}>
            {HITOS.map((h) => (
              <div className="stat" key={h.label}>
                <b>{h.valor}</b>
                <span>{h.label}</span>
              </div>
            ))}
          </div>

          <div className="prose">
            <h2>La empresa</h2>
            <p>
              Deep Service Chile nace para cubrir una necesidad concreta del sector marítimo
              nacional: que el equipamiento electrónico a bordo tenga detrás a alguien que
              lo conozca, lo instale bien y responda cuando falla.
            </p>
            <p>
              Trabajamos con embarcaciones de pesca industrial y artesanal, acuicultura,
              transporte marítimo y náutica recreativa, entregando el equipo, la instalación
              y la mantención como un solo servicio.
            </p>

            <h2>Cómo trabajamos</h2>
            <ul>
              <li><Check size={17} strokeWidth={3} aria-hidden="true" />Dimensionamos el equipo según la embarcación y la faena, no según catálogo.</li>
              <li><Check size={17} strokeWidth={3} aria-hidden="true" />Instalamos y calibramos a bordo, con la tripulación presente.</li>
              <li><Check size={17} strokeWidth={3} aria-hidden="true" />Capacitamos en el uso real del equipo antes de entregarlo.</li>
              <li><Check size={17} strokeWidth={3} aria-hidden="true" />Respondemos como contraparte técnica local durante toda la garantía.</li>
            </ul>

            <h2>Compromiso</h2>
            <p>
              Un sistema de detección o de navegación mal configurado no se nota el primer
              día: se nota cuando la faena depende de él. Por eso el servicio posventa no es
              un anexo del negocio, es el negocio.
            </p>
          </div>
        </div>
      </section>

      <section className="ds-section ds-dark">
        <span className="ds-grid-tex" aria-hidden="true" />
        <div className="ds-container" style={{ position: 'relative', zIndex: 2 }}>
          <SectionHead barra="Conversemos" titulo="¿Necesitas asesoría técnica?" />
          <p style={{ color: 'var(--on-dark-soft)', maxWidth: '60ch', lineHeight: 1.6, marginBottom: 28 }}>
            Cuéntanos qué embarcación tienes y qué necesitas resolver. Evaluamos el caso y
            te proponemos la configuración que corresponde.
          </p>
          <Link to="/contacto" className="ds-btn ds-btn--light">Contactar al equipo</Link>
        </div>
      </section>
    </>
  );
}
