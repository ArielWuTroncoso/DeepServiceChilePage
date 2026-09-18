import { Link } from 'react-router-dom';
import { Check, ChevronDown, PackageCheck, ShieldCheck, Wrench } from 'lucide-react';
import { useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import SectionHead from '../components/common/SectionHead';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { FAQ, SERVICIOS } from '../data/empresa';

const ICONOS = { PackageCheck, Wrench, ShieldCheck };

const PROCESO = [
  { n: '01', t: 'Diagnóstico', d: 'Revisamos la embarcación, la faena y los equipos existentes para entender qué se necesita realmente.' },
  { n: '02', t: 'Propuesta', d: 'Entregamos una cotización con la configuración recomendada, alternativas y plazos.' },
  { n: '03', t: 'Instalación', d: 'Montaje, cableado, puesta en marcha y calibración a bordo, con la tripulación presente.' },
  { n: '04', t: 'Acompañamiento', d: 'Capacitación de uso, garantía del fabricante y soporte técnico posterior.' },
];

export default function ServiciosPage() {
  useDocumentTitle('Servicios', 'Venta, instalación a bordo y soporte técnico de equipos electrónicos marinos.');
  const [abierta, setAbierta] = useState(0);

  return (
    <>
      <PageHeader
        eyebrow="Servicios"
        titulo="Venta, instalación y soporte"
        descripcion="Un equipo de electrónica marina vale por cómo queda instalado y por quién responde cuando falla. Cubrimos las tres etapas con servicio propio."
        migas={[{ label: 'Servicios' }]}
      />

      <section className="ds-section">
        <div className="ds-container">
          <div className="ds-grid ds-grid--3">
            {SERVICIOS.map((s) => {
              const Icono = ICONOS[s.icono] ?? Wrench;
              return (
                <article className="ds-card svc" key={s.slug} style={{ flexDirection: 'column' }}>
                  <span className="ds-badge" aria-hidden="true"><Icono size={26} /></span>
                  <div>
                    <h3>{s.titulo}</h3>
                    <p>{s.resumen}</p>
                    <ul>
                      {s.puntos.map((p) => (
                        <li key={p}><Check size={15} strokeWidth={3} aria-hidden="true" />{p}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="ds-section ds-dark">
        <span className="ds-grid-tex" aria-hidden="true" />
        <div className="ds-container" style={{ position: 'relative', zIndex: 2 }}>
          <header className="ds-section__head">
            <span className="ds-barlabel">Cómo trabajamos</span>
            <h2 className="ds-display ds-h2" style={{ color: '#fff', margin: '14px 0 12px' }}>De la consulta a la faena</h2>
            <p style={{ color: 'var(--on-dark-soft)', lineHeight: 1.55 }}>
              Cuatro etapas. Ninguna se salta, porque un equipo mal dimensionado o mal instalado
              termina costando más que el propio equipo.
            </p>
          </header>
          <div className="ds-grid ds-grid--4">
            {PROCESO.map((p) => (
              <article key={p.n} style={{ borderTop: '2px solid var(--b-400)', paddingTop: 20 }}>
                <span className="ds-display" style={{ fontSize: '2.6rem', color: 'var(--b-400)' }}>{p.n}</span>
                <h3 style={{ color: '#fff', fontSize: '1.08rem', fontWeight: 800, margin: '10px 0 8px' }}>{p.t}</h3>
                <p style={{ color: 'var(--on-dark-soft)', fontSize: '.93rem', lineHeight: 1.5 }}>{p.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ds-section">
        <div className="ds-container">
          <SectionHead barra="Preguntas frecuentes" titulo="Dudas habituales" />
          <div className="faq">
            {FAQ.map((f, i) => (
              <div className={`faq__item${abierta === i ? ' is-open' : ''}`} key={f.p}>
                <button
                  type="button"
                  className="faq__q"
                  onClick={() => setAbierta(abierta === i ? -1 : i)}
                  aria-expanded={abierta === i}
                >
                  {f.p} <ChevronDown size={19} aria-hidden="true" />
                </button>
                {abierta === i && <p className="faq__a">{f.r}</p>}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 34 }}>
            <Link to="/contacto" className="ds-btn ds-btn--primary">Hacer una consulta</Link>
          </div>
        </div>
      </section>
    </>
  );
}
