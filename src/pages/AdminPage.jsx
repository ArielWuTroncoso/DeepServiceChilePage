import { useEffect, useState } from 'react';
import { Inbox, Package, RefreshCw } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import EmptyState from '../components/common/EmptyState';
import LoadingScreen from '../components/common/LoadingScreen';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { listarProductos } from '../services/catalogoService';
import { listarSolicitudes, marcarAtendida } from '../services/contactoService';
import { useIdioma } from '../i18n/IdiomaContext';
import { useCatalogo } from '../i18n/datos';
import { mensajeError } from '../i18n/errores';

const PESTANAS = [
  { id: 'solicitudes', label: { es: 'Solicitudes de contacto', en: 'Contact requests' }, icono: Inbox },
  { id: 'productos', label: { es: 'Catálogo', en: 'Catalog' }, icono: Package },
];

export default function AdminPage() {
  const { t, idioma } = useIdioma();
  const { nombreCategoria, nombreMarca } = useCatalogo();
  useDocumentTitle(t('Panel de administración', 'Admin panel'));
  const [pestana, setPestana] = useState('solicitudes');
  const [solicitudes, setSolicitudes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargar = async () => {
    setCargando(true); setError('');
    try {
      const [s, p] = await Promise.all([
        listarSolicitudes().catch(() => []),
        listarProductos().catch(() => []),
      ]);
      setSolicitudes(Array.isArray(s) ? s : []);
      setProductos(Array.isArray(p) ? p : []);
    } catch (err) {
      setError(mensajeError(err, idioma));
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const atender = async (id) => {
    try {
      await marcarAtendida(id);
      setSolicitudes((lista) => lista.map((s) => (s.id === id ? { ...s, atendida: true } : s)));
    } catch (err) {
      setError(mensajeError(err, idioma));
    }
  };

  return (
    <>
      <PageHeader
        eyebrow={t('Interno', 'Internal')}
        titulo={t('Panel de administración', 'Admin panel')}
        descripcion={t('Solicitudes recibidas desde el sitio y estado del catálogo publicado.', 'Requests received through the website and status of the published catalog.')}
        migas={[{ label: t('Panel', 'Admin') }]}
      />

      <section className="ds-section">
        <div className="ds-container">
          <div className="admin__tabs" role="tablist">
            {PESTANAS.map(({ id, label, icono: Icono }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={pestana === id}
                className={`admin__tab${pestana === id ? ' is-active' : ''}`}
                onClick={() => setPestana(id)}
              >
                <Icono size={16} style={{ display: 'inline', marginRight: 8, verticalAlign: '-3px' }} />
                {label[idioma]}
              </button>
            ))}
            <button type="button" className="admin__tab" onClick={cargar} style={{ marginLeft: 'auto' }}>
              <RefreshCw size={16} style={{ display: 'inline', marginRight: 8, verticalAlign: '-3px' }} />
              {t('Actualizar', 'Refresh')}
            </button>
          </div>

          {error && <div className="ds-alert ds-alert--err" role="alert">{error}</div>}
          {cargando && <LoadingScreen mensaje={t('Cargando datos', 'Loading data')} />}

          {!cargando && pestana === 'solicitudes' && (
            solicitudes.length === 0
              ? <EmptyState icono={Inbox} titulo={t('Sin solicitudes', 'No requests')} mensaje={t('Las consultas enviadas desde el formulario de contacto aparecerán aquí.', 'Inquiries sent through the contact form will appear here.')} />
              : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="admin__table">
                    <thead>
                      <tr>
                        <th>{t('Fecha', 'Date')}</th><th>{t('Nombre', 'Name')}</th><th>{t('Contacto', 'Contact')}</th>
                        <th>{t('Interés', 'Interest')}</th><th>{t('Estado', 'Status')}</th><th />
                      </tr>
                    </thead>
                    <tbody>
                      {solicitudes.map((s) => (
                        <tr key={s.id}>
                          <td>{s.fechaCreacion ? new Date(s.fechaCreacion).toLocaleDateString(idioma === 'en' ? 'en-US' : 'es-CL') : '—'}</td>
                          <td>
                            <strong>{s.nombre}</strong>
                            {s.empresa && <><br /><span style={{ color: 'var(--ink-faint)', fontSize: '.85rem' }}>{s.empresa}</span></>}
                          </td>
                          <td>
                            <a href={`mailto:${s.correo}`}>{s.correo}</a>
                            {s.telefono && <><br /><a href={`tel:${s.telefono}`}>{s.telefono}</a></>}
                          </td>
                          <td>{s.interes || '—'}</td>
                          <td>
                            <span className={`admin__state admin__state--${s.atendida ? 'on' : 'off'}`}>
                              {s.atendida ? t('Atendida', 'Handled') : t('Pendiente', 'Pending')}
                            </span>
                          </td>
                          <td>
                            {!s.atendida && (
                              <button type="button" className="ds-btn ds-btn--outline ds-btn--sm" onClick={() => atender(s.id)}>
                                {t('Marcar atendida', 'Mark as handled')}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
          )}

          {!cargando && pestana === 'productos' && (
            productos.length === 0
              ? <EmptyState icono={Package} titulo={t('Catálogo vacío en la API', 'Catalog empty in the API')} mensaje={t('El backend todavía no devuelve productos. El sitio público muestra la estructura local mientras tanto.', 'The backend is not returning products yet. The public site shows the local data in the meantime.')} />
              : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="admin__table">
                    <thead>
                      <tr><th>{t('Modelo', 'Model')}</th><th>{t('Marca', 'Brand')}</th><th>{t('Categoría', 'Category')}</th><th>{t('Ficha', 'Specs')}</th></tr>
                    </thead>
                    <tbody>
                      {productos.map((p) => (
                        <tr key={p.id ?? p.slug}>
                          <td><strong>{p.nombre}</strong></td>
                          <td>{nombreMarca(p.marca)}</td>
                          <td>{nombreCategoria(p.categoria)}</td>
                          <td>
                            <span className={`admin__state admin__state--${p.completo ? 'on' : 'off'}`}>
                              {p.completo ? t('Completa', 'Complete') : t('En preparación', 'In preparation')}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
          )}
        </div>
      </section>
    </>
  );
}
