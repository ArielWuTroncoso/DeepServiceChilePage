import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ImageOff, Phone } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import EmptyState from '../components/common/EmptyState';
import ProductoCard from '../features/catalogo/ProductoCard';
import SectionHead from '../components/common/SectionHead';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { PRODUCTOS, nombreCategoria, nombreMarca } from '../data/catalogo';
import { CONTACTO } from '../data/empresa';

export default function ProductoPage() {
  const { slug } = useParams();
  const producto = PRODUCTOS.find((p) => p.slug === slug);
  useDocumentTitle(producto?.nombre ?? 'Producto no encontrado', producto?.resumen);

  if (!producto) {
    return (
      <>
        <PageHeader titulo="Producto no encontrado" migas={[{ label: 'Productos', to: '/productos' }, { label: 'No encontrado' }]} />
        <section className="ds-section">
          <div className="ds-container">
            <EmptyState titulo="Ese equipo no está en el catálogo" mensaje="Puede que el enlace esté desactualizado.">
              <Link to="/productos" className="ds-btn ds-btn--primary ds-btn--sm">Volver al catálogo</Link>
            </EmptyState>
          </div>
        </section>
      </>
    );
  }

  const { nombre, subcategoria, marca, categoria, resumen, descripcion, especificaciones, destacados, chips, completo, galeria } = producto;
  const relacionados = PRODUCTOS.filter((p) => p.categoria === categoria && p.slug !== slug).slice(0, 3);

  return (
    <>
      <PageHeader
        eyebrow={nombreMarca(marca)}
        titulo={nombre}
        descripcion={subcategoria}
        migas={[{ label: 'Productos', to: '/productos' }, { label: nombreCategoria(categoria), to: `/productos?categoria=${categoria}` }, { label: nombre }]}
      />

      <section className="ds-section">
        <div className="ds-container">
          <div className="pdp">
            <div className="pdp__media">
              <div className="pdp__slot">
                <ImageOff size={40} strokeWidth={1.4} aria-hidden="true" />
                <b style={{ fontSize: '.82rem', letterSpacing: '.13em', textTransform: 'uppercase' }}>Imagen principal</b>
                <span style={{ fontSize: '.85rem', maxWidth: '30ch', lineHeight: 1.5 }}>
                  Espacio reservado para la fotografía oficial del equipo.
                </span>
              </div>
              <div className="pdp__thumbs">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div className="pdp__thumb" key={i}>{galeria?.[i] ? '' : `Vista ${i + 1}`}</div>
                ))}
              </div>
            </div>

            <div>
              <div className="pdp__brand">
                <span className="ds-eyebrow">{nombreMarca(marca)}</span>
                {!completo && <span className="ds-tag">Ficha en preparación</span>}
              </div>
              <h1 className="ds-display ds-h2">{nombre}</h1>
              <p className="pdp__sub">{resumen}</p>

              {chips.length > 0 && (
                <div className="pdp__chips">
                  {chips.map((c) => (
                    <div className="ds-chip" key={c.label}>
                      <div className="ds-chip__v">{c.valor}<small>{c.unidad}</small></div>
                      <div className="ds-chip__l">{c.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {descripcion && <p className="ds-lead" style={{ marginBottom: 8 }}>{descripcion}</p>}

              {destacados.length > 0 && (
                <div className="pdp__feats">
                  {destacados.map((f) => (
                    <div className="pdp__feat" key={f.titulo}>
                      <span className="ds-tri" aria-hidden="true" style={{ marginTop: 4 }} />
                      <div>
                        <b>{f.titulo}</b>
                        <p>{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="pdp__actions">
                <Link to={`/contacto?producto=${slug}`} className="ds-btn ds-btn--primary">
                  Cotizar este equipo
                </Link>
                <a href={`tel:${CONTACTO.ejecutivos[0].tel}`} className="ds-btn ds-btn--outline">
                  <Phone size={17} /> Llamar a un ejecutivo
                </a>
              </div>
            </div>
          </div>

          {especificaciones.length > 0 && (
            <div style={{ marginTop: 'clamp(40px, 6vw, 72px)' }}>
              <span className="ds-barlabel">Especificaciones técnicas</span>
              <table className="pdp__table">
                <caption className="ds-sr-only">Especificaciones técnicas de {nombre}</caption>
                <tbody>
                  {especificaciones.map((e) => (
                    <tr key={e.clave}>
                      <th scope="row">{e.clave}</th>
                      <td>{e.valor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="field__hint" style={{ marginTop: 14 }}>
                Datos según la documentación oficial del fabricante. Algunas funciones requieren transductor o accesorios compatibles.
              </p>
            </div>
          )}
        </div>
      </section>

      {relacionados.length > 0 && (
        <section className="ds-section" style={{ background: 'var(--paper-2)' }}>
          <div className="ds-container">
            <SectionHead barra="También en esta línea" titulo={nombreCategoria(categoria)} />
            <div className="ds-grid ds-grid--3">
              {relacionados.map((p) => <ProductoCard producto={p} key={p.id} />)}
            </div>
            <div style={{ marginTop: 30 }}>
              <Link to="/productos" className="ds-btn ds-btn--outline">
                <ArrowLeft size={17} /> Volver al catálogo
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
