import { useEffect, useState } from 'react';
import { Inbox, Package, RefreshCw } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import EmptyState from '../components/common/EmptyState';
import LoadingScreen from '../components/common/LoadingScreen';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { listarProductos } from '../services/catalogoService';
import { listarSolicitudes, marcarAtendida } from '../services/contactoService';
import { nombreCategoria, nombreMarca } from '../data/catalogo';

const PESTANAS = [
  { id: 'solicitudes', label: 'Solicitudes de contacto', icono: Inbox },
  { id: 'productos', label: 'Catálogo', icono: Package },
];

export default function AdminPage() {
  useDocumentTitle('Panel de administración');
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
      setError(err.message);
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
      setError(err.message);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Interno"
        titulo="Panel de administración"
        descripcion="Solicitudes recibidas desde el sitio y estado del catálogo publicado."
        migas={[{ label: 'Panel' }]}
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
                {label}
              </button>
            ))}
            <button type="button" className="admin__tab" onClick={cargar} style={{ marginLeft: 'auto' }}>
              <RefreshCw size={16} style={{ display: 'inline', marginRight: 8, verticalAlign: '-3px' }} />
              Actualizar
            </button>
          </div>

          {error && <div className="ds-alert ds-alert--err" role="alert">{error}</div>}
          {cargando && <LoadingScreen mensaje="Cargando datos" />}

          {!cargando && pestana === 'solicitudes' && (
            solicitudes.length === 0
              ? <EmptyState icono={Inbox} titulo="Sin solicitudes" mensaje="Las consultas enviadas desde el formulario de contacto aparecerán aquí." />
              : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="admin__table">
                    <thead>
                      <tr>
                        <th>Fecha</th><th>Nombre</th><th>Contacto</th>
                        <th>Interés</th><th>Estado</th><th />
                      </tr>
                    </thead>
                    <tbody>
                      {solicitudes.map((s) => (
                        <tr key={s.id}>
                          <td>{s.fechaCreacion ? new Date(s.fechaCreacion).toLocaleDateString('es-CL') : '—'}</td>
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
                              {s.atendida ? 'Atendida' : 'Pendiente'}
                            </span>
                          </td>
                          <td>
                            {!s.atendida && (
                              <button type="button" className="ds-btn ds-btn--outline ds-btn--sm" onClick={() => atender(s.id)}>
                                Marcar atendida
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
              ? <EmptyState icono={Package} titulo="Catálogo vacío en la API" mensaje="El backend todavía no devuelve productos. El sitio público muestra la estructura local mientras tanto." />
              : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="admin__table">
                    <thead>
                      <tr><th>Modelo</th><th>Marca</th><th>Categoría</th><th>Ficha</th></tr>
                    </thead>
                    <tbody>
                      {productos.map((p) => (
                        <tr key={p.id ?? p.slug}>
                          <td><strong>{p.nombre}</strong></td>
                          <td>{nombreMarca(p.marca)}</td>
                          <td>{nombreCategoria(p.categoria)}</td>
                          <td>
                            <span className={`admin__state admin__state--${p.completo ? 'on' : 'off'}`}>
                              {p.completo ? 'Completa' : 'En preparación'}
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
