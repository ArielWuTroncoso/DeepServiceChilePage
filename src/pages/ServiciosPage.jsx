import { Link } from 'react-router-dom';
import { useState } from 'react';
import {
  Anchor, BadgeCheck, Check, ChevronDown, ClipboardCheck, Container, Map,
  Headset, Radar, Antenna, Sailboat, ShieldCheck, Ship, Wrench,
} from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import SectionHead from '../components/common/SectionHead';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import {
  CLIENTES, ENTIDAD_TECNICA, FAQ, INTRO_SERVICIOS, SERVICIOS,
} from '../data/empresa';

const ICONOS = {
  Radar, Antenna, ClipboardCheck, Map, Ship, ShieldCheck, Wrench,
  Anchor, Container, Sailboat,
};
const Icono = ({ nombre, ...props }) => {
  const C = ICONOS[nombre] ?? Wrench;
  return <C {...props} />;
};

const PROCESO = [
  { n: '01', t: 'Diagnóstico', d: 'Revisamos la embarcación, la faena y los equipos instalados para identificar la falla o dimensionar el trabajo.' },
  { n: '02', t: 'Propuesta', d: 'Entregamos una cotización con el alcance del servicio, los repuestos involucrados y los plazos.' },
  { n: '03', t: 'Intervención', d: 'Ejecutamos en taller, a bordo o en zona de pesca, según lo que el equipo necesite.' },
  { n: '04', t: 'Respaldo', d: 'Instrucción de uso, certificación cuando corresponde y contrato de mantenimiento si se requiere.' },
];

export default function ServiciosPage() {
  useDocumentTitle(
    'Servicio técnico',
    'Mantención de sonares y radares Furuno, instalación a bordo, inspecciones GMDSS y reparación de equipos marinos.',
  );
  const [abierta, setAbierta] = useState(0);

  return (
    <>
      <PageHeader
        eyebrow="Servicio técnico"
        titulo="Todo tipo de servicio electrónico marino"
        descripcion={INTRO_SERVICIOS}
        migas={[{ label: 'Servicio técnico' }]}
      />

      {/* ---------- Los siete servicios ---------- */}
      <section className="ds-section">
        <div className="ds-container">
          <SectionHead
            barra="Lo que hacemos"
            titulo="Servicios que realizamos"
            descripcion="Mantención, instalación, inspección y reparación de equipamiento electrónico de navegación, pesca y seguridad."
          />
          <div className="ds-grid ds-grid--3">
            {SERVICIOS.map((s) => (
              <article className="ds-card ds-card--hover svc" key={s.slug} style={{ flexDirection: 'column' }}>
                <span className="ds-badge" aria-hidden="true"><Icono nombre={s.icono} size={26} /></span>
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
            ))}

            {/* Octava casilla: completa la retícula y ofrece la salida a contacto. */}
            <article className="svc-cta">
              <span className="svc-cta__icon" aria-hidden="true"><Headset size={26} /></span>
              <h3>¿Tu equipo no está en la lista?</h3>
              <p>
                Trabajamos con la mayor parte del equipamiento electrónico de navegación,
                pesca y seguridad. Cuéntanos qué necesitas y lo evaluamos.
              </p>
              <Link to="/contacto" className="ds-btn ds-btn--light ds-btn--sm">
                Consultar por un servicio
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* ---------- Entidad técnica aprobada ---------- */}
      <section className="ds-section ds-dark">
        <span className="ds-grid-tex" aria-hidden="true" />
        <div className="ds-container" style={{ position: 'relative', zIndex: 2 }}>
          <header className="ds-section__head">
            <span className="ds-barlabel">Acreditación</span>
            <h2 className="ds-display ds-h2" style={{ color: '#fff', margin: '14px 0 12px' }}>
              {ENTIDAD_TECNICA.titulo}
            </h2>
            <p style={{ color: 'var(--on-dark-soft)', lineHeight: 1.55, maxWidth: '62ch' }}>
              {ENTIDAD_TECNICA.intro}
            </p>
          </header>

          <div className="ds-grid ds-grid--4">
            {ENTIDAD_TECNICA.puntos.map((p) => (
              <article className="eta" key={p.titulo}>
                <span className="eta__icon" aria-hidden="true"><BadgeCheck size={24} /></span>
                <h3>{p.titulo}</h3>
                <p>{p.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Proceso ---------- */}
      <section className="ds-section">
        <div className="ds-container">
          <SectionHead
            barra="Cómo trabajamos"
            titulo="De la consulta a la faena"
            descripcion="Cuatro etapas. Ninguna se salta, porque un equipo mal diagnosticado o mal instalado termina costando más que el propio equipo."
          />
          <div className="ds-grid ds-grid--4">
            {PROCESO.map((p) => (
              <article key={p.n} style={{ borderTop: '2px solid var(--b-500)', paddingTop: 20 }}>
                <span className="ds-display" style={{ fontSize: '2.6rem', color: 'var(--b-500)' }}>{p.n}</span>
                <h3 style={{ fontSize: '1.08rem', fontWeight: 800, margin: '10px 0 8px' }}>{p.t}</h3>
                <p style={{ color: 'var(--ink-soft)', fontSize: '.93rem', lineHeight: 1.5 }}>{p.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Clientes ---------- */}
      <section className="ds-section" style={{ background: 'var(--paper-2)' }}>
        <div className="ds-container">
          <SectionHead barra="A quién atendemos" titulo="Nuestros principales clientes" />
          <div className="ds-grid ds-grid--4">
            {CLIENTES.map((c) => (
              <article className="ds-card cliente" key={c.titulo}>
                <span className="cliente__icon" aria-hidden="true"><Icono nombre={c.icono} size={30} /></span>
                <h3>{c.titulo}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Preguntas frecuentes ---------- */}
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
