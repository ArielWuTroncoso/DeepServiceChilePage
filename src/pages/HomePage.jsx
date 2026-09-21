import { Link } from 'react-router-dom';
import {
  Anchor, Antenna, ArrowRight, Check, ClipboardCheck, Compass, Container, Fish,
  HardHat, LifeBuoy, Map, PackageCheck, Phone, Radar, RadioTower, Sailboat,
  ShieldCheck, Ship, Waves, Wrench, Cable,
} from 'lucide-react';
import SectionHead from '../components/common/SectionHead';
import MarcaSlot from '../components/common/MarcaSlot';
import HeroVideos from '../components/home/HeroVideos';
import { useReveal } from '../hooks/useReveal';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { CATEGORIAS, MARCAS, PRODUCTOS } from '../data/catalogo';
import { CONTACTO, MERCADOS, SERVICIOS } from '../data/empresa';

const ICONOS = {
  Fish, Compass, RadioTower, LifeBuoy, Cable,
  Ship, Anchor, Waves, Container, Sailboat, HardHat,
  PackageCheck, Wrench, ShieldCheck,
  Radar, Antenna, ClipboardCheck, Map,
};

/* La portada muestra una selección; el listado completo vive en /servicios. */
const SERVICIOS_PORTADA = ['mantenimiento-sonares', 'instalacion', 'inspecciones-gmdss'];
const Icono = ({ nombre, ...props }) => {
  const C = ICONOS[nombre] ?? Fish;
  return <C {...props} />;
};

export default function HomePage() {
  useDocumentTitle(
    null,
    'Deep Service Chile: venta, instalación y soporte técnico de equipos electrónicos marinos para navegación y pesca.',
  );
  const destacado = PRODUCTOS.find((p) => p.destacado && p.completo);

  return (
    <>
      {/* ---------- Portada ---------- */}
      <section className="hero">
        <span className="ds-arcs" aria-hidden="true" />
        <span className="ds-grid-tex" aria-hidden="true" />
        <div className="ds-container">
          <div className="hero__inner">
            <div>
              <div className="hero__kicker">
                <span className="ds-tag ds-tag--ghost">Electrónica marina</span>
                <b>Navegación y pesca</b>
              </div>
              <h1 className="ds-display ds-h1">
                Precisión bajo <span className="ds-accent">la superficie</span>
              </h1>
              <p className="hero__lead">
                Soluciones y <strong>respaldo técnico</strong> en equipos electrónicos marinos.
                Vendemos, instalamos y mantenemos la tecnología que tu embarcación necesita
                para operar con seguridad y rendimiento.
              </p>
              <div className="hero__cta">
                <Link to="/productos" className="ds-btn ds-btn--light">
                  Ver catálogo <ArrowRight size={17} />
                </Link>
                <Link to="/contacto" className="ds-btn ds-btn--onDark">Solicitar cotización</Link>
              </div>
              <div className="hero__stats">
                {[
                  { v: '5', l: 'Marcas representadas' },
                  { v: '7', l: 'Servicios técnicos' },
                  { v: 'ETA', l: 'Entidad técnica aprobada' },
                ].map(({ v, l }) => (
                  <div className="ds-chip" key={l}>
                    <div className="ds-chip__v">{v}</div>
                    <div className="ds-chip__l">{l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hero__visual">
              <HeroVideos />
            </div>
          </div>
        </div>

        <svg className="hero__wave" viewBox="0 0 1440 70" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 40 C 220 8, 420 66, 640 40 S 1080 4, 1290 34 S 1400 52, 1440 42 L1440 70 L0 70 Z" fill="var(--paper)" />
        </svg>
      </section>

      {/* ---------- Líneas de producto ---------- */}
      <section className="ds-section">
        <div className="ds-container">
          <SectionHead
            barra="Catálogo"
            titulo="Qué equipamos a bordo"
            descripcion="Cuatro líneas de producto más accesorios, organizadas por el trabajo que resuelven en la embarcación."
          />
          <div className="ds-grid ds-grid--3">
            {CATEGORIAS.map((c, i) => {
              const total = PRODUCTOS.filter((p) => p.categoria === c.slug).length;
              return (
                <Link
                  key={c.slug}
                  to={`/productos?categoria=${c.slug}`}
                  className="ds-card ds-card--hover pillar ds-reveal is-visible"
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <span className="ds-badge" aria-hidden="true"><Icono nombre={c.icono} size={26} /></span>
                  <h3>{c.nombre}</h3>
                  <p>{c.desc}</p>
                  <span className="pillar__more">
                    Ver {total} {total === 1 ? 'equipo' : 'equipos'} <ArrowRight size={15} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- Producto destacado ---------- */}
      {destacado && (
        <section className="ds-section spotlight ds-dark">
          <span className="ds-grid-tex" aria-hidden="true" />
          <div className="ds-container">
            <div className="spotlight__inner">
              <div className="spotlight__media">
                <span className="spotlight__glow" aria-hidden="true" />
                <picture>
                  <img
                    className="spotlight__img"
                    src={destacado.imagen}
                    alt={`Sonda de pesca Furuno ${destacado.nombre}`}
                    width="570"
                    height="568"
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
              </div>

              <div>
                <span className="ds-tag">Destacado</span>
                <h2 className="ds-display ds-h2">
                  {destacado.nombre} <span className="ds-accent">{destacado.subcategoria}</span>
                </h2>
                <p className="spotlight__lead">{destacado.resumen}</p>

                <div className="spotlight__feats">
                  {destacado.destacados.slice(0, 3).map((f) => (
                    <div className="spotlight__feat" key={f.titulo}>
                      <span className="ds-tri" aria-hidden="true" />
                      <div>
                        <b>{f.titulo}</b>
                        <p>{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link to={`/productos/${destacado.slug}`} className="ds-btn ds-btn--light">
                  Ver ficha completa <ArrowRight size={17} />
                </Link>

                <div className="spotlight__chips">
                  {destacado.chips.map((c) => (
                    <div className="ds-chip" key={c.label}>
                      <div className="ds-chip__v">{c.valor}<small>{c.unidad}</small></div>
                      <div className="ds-chip__l">{c.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ---------- Servicios ---------- */}
      <section className="ds-section">
        <div className="ds-container">
          <SectionHead
            barra="Servicio técnico"
            titulo="No sólo vendemos el equipo"
            descripcion="Nuestro servicio técnico está capacitado para realizar todo tipo de servicio electrónico, dando soluciones rápidas y eficientes a las necesidades de nuestros clientes."
          />
          <div className="ds-grid ds-grid--3">
            {SERVICIOS.filter((s) => SERVICIOS_PORTADA.includes(s.slug)).map((s) => (
              <article className="ds-card ds-card--hover svc" key={s.slug}>
                <span className="ds-badge" aria-hidden="true"><Icono nombre={s.icono} size={26} /></span>
                <div>
                  <h3>{s.titulo}</h3>
                  <p>{s.resumen}</p>
                  <ul>
                    {s.puntos.slice(0, 3).map((p) => (
                      <li key={p}><Check size={15} strokeWidth={3} aria-hidden="true" />{p}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
          <div style={{ marginTop: 32 }}>
            <Link to="/servicios" className="ds-btn ds-btn--outline">
              Ver los {SERVICIOS.length} servicios <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Mercados ---------- */}
      <section className="ds-section" style={{ background: 'var(--paper-2)' }}>
        <div className="ds-container">
          <SectionHead
            barra="Mercados"
            titulo="A quién atendemos"
            descripcion="Cada operación tiene exigencias distintas. La configuración del equipamiento cambia según el tipo de faena."
          />
          <div className="ds-grid ds-grid--3">
            {MERCADOS.map((m) => (
              <article className="ds-card market" key={m.slug}>
                <span className="market__icon" aria-hidden="true"><Icono nombre={m.icono} size={34} /></span>
                <h3>{m.titulo}</h3>
                <p>{m.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Marcas ---------- */}
      <section className="ds-section">
        <div className="ds-container">
          <SectionHead
            barra="Representaciones"
            titulo="Marcas que trabajamos"
            descripcion="Equipamiento de fabricantes con respaldo de fábrica y servicio técnico propio en Chile."
          />
          <div className="ds-grid ds-grid--4">
            {MARCAS.map((m) => <MarcaSlot marca={m} key={m.slug} alto={124} />)}
          </div>
          <div style={{ marginTop: 32 }}>
            <Link to="/marcas" className="ds-btn ds-btn--outline">
              Ver todas las marcas <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Cierre ---------- */}
      <section className="closer">
        <span className="closer__halo" aria-hidden="true" />
        <div className="ds-container">
          <div className="closer__inner">
            <div>
              <h2 className="ds-display ds-h2">Consulta por tu equipo</h2>
              <p>Asesoría técnica, cotización e instalación a bordo.</p>
            </div>
            <div className="closer__contacts">
              {CONTACTO.ejecutivos.map((e) => (
                <a className="closer__pill" href={`tel:${e.tel}`} key={e.tel}>
                  <Phone size={20} />
                  <b>{e.nombre}</b>
                  <i aria-hidden="true" />
                  <span>{e.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
