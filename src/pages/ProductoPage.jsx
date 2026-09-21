import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Phone } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import EmptyState from '../components/common/EmptyState';
import ProductoCard from '../features/catalogo/ProductoCard';
import GaleriaProducto from '../features/catalogo/GaleriaProducto';
import SectionHead from '../components/common/SectionHead';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useIdioma } from '../i18n/IdiomaContext';
import { useCatalogo, useEmpresa } from '../i18n/datos';

export default function ProductoPage() {
  const { slug } = useParams();
  const { t } = useIdioma();
  const { PRODUCTOS, nombreCategoria, nombreMarca } = useCatalogo();
  const { CONTACTO } = useEmpresa();
  const producto = PRODUCTOS.find((p) => p.slug === slug);
  useDocumentTitle(producto?.nombre ?? t('Producto no encontrado', 'Product not found'), producto?.resumen);

  if (!producto) {
    return (
      <>
        <PageHeader
          titulo={t('Producto no encontrado', 'Product not found')}
          migas={[{ label: t('Productos', 'Products'), to: '/productos' }, { label: t('No encontrado', 'Not found') }]}
        />
        <section className="ds-section">
          <div className="ds-container">
            <EmptyState
              titulo={t('Ese equipo no está en el catálogo', 'That item is not in the catalog')}
              mensaje={t('Puede que el enlace esté desactualizado.', 'The link may be out of date.')}
            >
              <Link to="/productos" className="ds-btn ds-btn--primary ds-btn--sm">{t('Volver al catálogo', 'Back to catalog')}</Link>
            </EmptyState>
          </div>
        </section>
      </>
    );
  }

  const { nombre, subcategoria, marca, categoria, resumen, descripcion, especificaciones, destacados, chips, completo, imagen, galeria } = producto;
  const relacionados = PRODUCTOS.filter((p) => p.categoria === categoria && p.slug !== slug).slice(0, 3);

  return (
    <>
      <PageHeader
        eyebrow={nombreMarca(marca)}
        titulo={nombre}
        descripcion={subcategoria}
        migas={[{ label: t('Productos', 'Products'), to: '/productos' }, { label: nombreCategoria(categoria), to: `/productos?categoria=${categoria}` }, { label: nombre }]}
      />

      <section className="ds-section">
        <div className="ds-container">
          <div className="pdp">
            <div className="pdp__media">
              <GaleriaProducto
                key={slug}
                nombre={nombre}
                imagenes={galeria?.length ? galeria : (imagen ? [{ src: imagen, alt: nombre }] : [])}
              />
            </div>

            <div>
              <div className="pdp__brand">
                <span className="ds-eyebrow">{nombreMarca(marca)}</span>
                {!completo && <span className="ds-tag">{t('Ficha en preparación', 'Specs coming soon')}</span>}
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
                  {t('Cotizar este equipo', 'Get a quote for this item')}
                </Link>
                <a href={`tel:${CONTACTO.ejecutivos[0].tel}`} className="ds-btn ds-btn--outline">
                  <Phone size={17} /> {t('Llamar a un ejecutivo', 'Call a sales rep')}
                </a>
              </div>
            </div>
          </div>

          {especificaciones.length > 0 && (
            <div style={{ marginTop: 'clamp(40px, 6vw, 72px)' }}>
              <span className="ds-barlabel">{t('Especificaciones técnicas', 'Technical specifications')}</span>
              <table className="pdp__table">
                <caption className="ds-sr-only">{t(`Especificaciones técnicas de ${nombre}`, `${nombre} technical specifications`)}</caption>
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
                {t(
                  'Datos según la documentación oficial del fabricante. Algunas funciones requieren transductor o accesorios compatibles.',
                  'Data according to the manufacturer’s official documentation. Some functions require a compatible transducer or accessories.',
                )}
              </p>
            </div>
          )}
        </div>
      </section>

      {relacionados.length > 0 && (
        <section className="ds-section" style={{ background: 'var(--paper-2)' }}>
          <div className="ds-container">
            <SectionHead barra={t('También en esta línea', 'Also in this line')} titulo={nombreCategoria(categoria)} />
            <div className="ds-grid ds-grid--3">
              {relacionados.map((p) => <ProductoCard producto={p} key={p.id} />)}
            </div>
            <div style={{ marginTop: 30 }}>
              <Link to="/productos" className="ds-btn ds-btn--outline">
                <ArrowLeft size={17} /> {t('Volver al catálogo', 'Back to catalog')}
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
