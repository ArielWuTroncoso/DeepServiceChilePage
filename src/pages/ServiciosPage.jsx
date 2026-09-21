import { Link } from 'react-router-dom';
import { useState } from 'react';
import {
  Anchor, BadgeCheck, Check, ChevronDown, ClipboardCheck, Container, Map,
  Headset, Radar, Antenna, Sailboat, ShieldCheck, Ship, Wrench,
} from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import SectionHead from '../components/common/SectionHead';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useIdioma } from '../i18n/IdiomaContext';
import { useEmpresa } from '../i18n/datos';

const ICONOS = {
  Radar, Antenna, ClipboardCheck, Map, Ship, ShieldCheck, Wrench,
  Anchor, Container, Sailboat,
};
const Icono = ({ nombre, ...props }) => {
  const C = ICONOS[nombre] ?? Wrench;
  return <C {...props} />;
};

const PROCESO = {
  es: [
    { n: '01', t: 'Diagnóstico', d: 'Revisamos la embarcación, la faena y los equipos instalados para identificar la falla o dimensionar el trabajo.' },
    { n: '02', t: 'Propuesta', d: 'Entregamos una cotización con el alcance del servicio, los repuestos involucrados y los plazos.' },
    { n: '03', t: 'Intervención', d: 'Ejecutamos en taller, a bordo o en zona de pesca, según lo que el equipo necesite.' },
    { n: '04', t: 'Respaldo', d: 'Instrucción de uso, certificación cuando corresponde y contrato de mantenimiento si se requiere.' },
  ],
  en: [
    { n: '01', t: 'Diagnosis', d: 'We review the vessel, its operation and the installed equipment to locate the fault or scope the job.' },
    { n: '02', t: 'Proposal', d: 'We provide a quote with the scope of service, the spare parts involved and the timeline.' },
    { n: '03', t: 'Execution', d: 'We carry out the work in our workshop, on board or on the fishing grounds, as the equipment requires.' },
    { n: '04', t: 'Support', d: 'Operator training, certification where applicable and a maintenance contract if required.' },
  ],
};

export default function ServiciosPage() {
  const { t, idioma } = useIdioma();
  const { CLIENTES, ENTIDAD_TECNICA, FAQ, INTRO_SERVICIOS, SERVICIOS } = useEmpresa();
  useDocumentTitle(
    t('Servicio técnico', 'Technical service'),
    t('Mantención de sonares y radares Furuno, instalación a bordo, inspecciones GMDSS y reparación de equipos marinos.',
      'Furuno sonar and radar maintenance, on-board installation, GMDSS inspections and marine equipment repair.'),
  );
  const [abierta, setAbierta] = useState(0);

  return (
    <>
      <PageHeader
        eyebrow={t('Servicio técnico', 'Technical service')}
        titulo={t('Todo tipo de servicio electrónico marino', 'All types of marine electronics service')}
        descripcion={INTRO_SERVICIOS}
        migas={[{ label: t('Servicio técnico', 'Technical service') }]}
      />

      {/* ---------- Los siete servicios ---------- */}
      <section className="ds-section">
        <div className="ds-container">
          <SectionHead
            barra={t('Lo que hacemos', 'What we do')}
            titulo={t('Servicios que realizamos', 'Our services')}
            descripcion={t(
              'Mantención, instalación, inspección y reparación de equipamiento electrónico de navegación, pesca y seguridad.',
              'Maintenance, installation, inspection and repair of navigation, fishing and safety electronics.',
            )}
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
              <h3>{t('¿Tu equipo no está en la lista?', 'Is your equipment not on the list?')}</h3>
              <p>
                {t(
                  'Trabajamos con la mayor parte del equipamiento electrónico de navegación, pesca y seguridad. Cuéntanos qué necesitas y lo evaluamos.',
                  'We work with most navigation, fishing and safety electronics. Tell us what you need and we will assess it.',
                )}
              </p>
              <Link to="/contacto" className="ds-btn ds-btn--light ds-btn--sm">
                {t('Consultar por un servicio', 'Ask about a service')}
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
            <span className="ds-barlabel">{t('Acreditación', 'Accreditation')}</span>
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
            barra={t('Cómo trabajamos', 'How we work')}
            titulo={t('De la consulta a la faena', 'From inquiry to operation')}
            descripcion={t(
              'Cuatro etapas. Ninguna se salta, porque un equipo mal diagnosticado o mal instalado termina costando más que el propio equipo.',
              'Four stages, none of them skipped, because a poorly diagnosed or poorly installed unit ends up costing more than the unit itself.',
            )}
          />
          <div className="ds-grid ds-grid--4">
            {PROCESO[idioma].map((p) => (
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
          <SectionHead barra={t('A quién atendemos', 'Who we serve')} titulo={t('Nuestros principales clientes', 'Our main customers')} />
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
          <SectionHead barra={t('Preguntas frecuentes', 'FAQ')} titulo={t('Dudas habituales', 'Common questions')} />
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
            <Link to="/contacto" className="ds-btn ds-btn--primary">{t('Hacer una consulta', 'Send an inquiry')}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
