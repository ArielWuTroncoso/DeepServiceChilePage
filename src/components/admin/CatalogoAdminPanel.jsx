import { useMemo, useState } from 'react';
import { EyeOff, Eye, Package, Pencil, Plus } from 'lucide-react';
import EmptyState from '../common/EmptyState';
import BuscadorCascada, { BUSQUEDA_VACIA } from './BuscadorCascada';
import FormularioEquipo from './FormularioEquipo';
import { cambiarActivoEquipo } from '../../services/adminService';
import { useIdioma } from '../../i18n/IdiomaContext';
import { useCatalogo } from '../../i18n/datos';
import { mensajeError } from '../../i18n/errores';
import { filtrarInventario } from '../../utils/inventario';

/** Gestión de los equipos del catálogo: agregar, editar y dar de baja (o reactivar) en el sitio. */
export default function CatalogoAdminPanel({ equipos, setEquipos, onError, alCrear }) {
  const { t, idioma } = useIdioma();
  const { nombreCategoria, nombreMarca } = useCatalogo();
  const [busqueda, setBusqueda] = useState(BUSQUEDA_VACIA);
  const [formulario, setFormulario] = useState(null); // null | { equipo?: ProductoAdmin }
  const [ocupado, setOcupado] = useState(null);

  // El buscador y el filtro trabajan con la forma de inventario (productoId).
  const items = useMemo(() => equipos.map((e) => ({ ...e, productoId: e.id })), [equipos]);
  const visibles = useMemo(() => filtrarInventario(items, busqueda), [items, busqueda]);

  const guardado = (e, creado) => {
    setEquipos((lista) => (creado
      ? [...lista, e].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
      : lista.map((x) => (x.id === e.id ? e : x))));
    if (creado) alCrear?.();
  };

  const alternar = async (e) => {
    const baja = e.activo;
    if (baja && !window.confirm(t(
      `¿Dar de baja “${e.nombre}”? Dejará de verse en el sitio público. Su stock y su historial se conservan y puedes reactivarlo cuando quieras.`,
      `Deactivate “${e.nombre}”? It will no longer show on the public website. Its stock and history are kept and you can reactivate it any time.`,
    ))) return;
    setOcupado(e.id);
    try {
      const nuevo = await cambiarActivoEquipo(e.id, !e.activo);
      setEquipos((lista) => lista.map((x) => (x.id === e.id ? nuevo : x)));
    } catch (err) {
      onError(mensajeError(err, idioma, { contexto: 'panel' }));
    } finally {
      setOcupado(null);
    }
  };

  return (
    <div>
      <div className="adm-encabezado">
        <p className="adm-ayuda adm-ayuda--texto">
          {t('Los equipos activos se muestran en el sitio público. Al dar de baja un equipo deja de verse, pero no se pierde su stock ni su historial.',
            'Active equipment is shown on the public website. Deactivating an item hides it, but its stock and history are kept.')}
        </p>
        <button type="button" className="ds-btn ds-btn--primary ds-btn--sm" onClick={() => setFormulario({})}>
          <Plus size={16} /> {t('Nuevo equipo', 'New equipment')}
        </button>
      </div>

      {equipos.length === 0 ? (
        <EmptyState icono={Package} titulo={t('Catálogo vacío', 'Empty catalog')}
          mensaje={t('Agrega el primer equipo con el botón “Nuevo equipo”.', 'Add the first item with the “New equipment” button.')} />
      ) : (
        <>
          <BuscadorCascada items={items} valor={busqueda} onCambiar={setBusqueda} idPrefijo="cat" />
          <p className="adm-contador" aria-live="polite">{t(`${visibles.length} de ${equipos.length} equipos`, `${visibles.length} of ${equipos.length} items`)}</p>

          {visibles.length === 0 ? (
            <EmptyState titulo={t('Ningún equipo coincide', 'No item matches')} mensaje={t('Cambia la categoría, la marca o el texto de búsqueda.', 'Change the category, brand or search text.')} />
          ) : (
            <div className="adm-scroll">
              <table className="admin__table adm-tarjetas">
                <thead>
                  <tr>
                    <th>{t('Equipo', 'Equipment')}</th><th>{t('Marca · Categoría', 'Brand · Category')}</th>
                    <th>{t('Ficha', 'Page')}</th><th>{t('En el sitio', 'On the website')}</th><th />
                  </tr>
                </thead>
                <tbody>
                  {visibles.map((e) => (
                    <tr key={e.id} className={e.activo ? '' : 'is-baja'}>
                      <td><strong>{e.nombre}</strong><br /><span className="adm-sub">{e.slug}</span></td>
                      <td>{nombreMarca(e.marca)}<br /><span className="adm-sub">{nombreCategoria(e.categoria)}</span></td>
                      <td>
                        <span className={`admin__state admin__state--${e.completo ? 'on' : 'off'}`}>
                          {e.completo ? t('Completa', 'Complete') : t('En preparación', 'In preparation')}
                        </span>
                      </td>
                      <td>
                        <span className={`admin__state admin__state--${e.activo ? 'on' : 'err'}`}>
                          {e.activo ? t('Visible', 'Visible') : t('Dado de baja', 'Deactivated')}
                        </span>
                      </td>
                      <td>
                        <div className="adm-fila-acciones">
                          <button type="button" className="ds-btn ds-btn--outline ds-btn--sm" onClick={() => setFormulario({ equipo: e })}>
                            <Pencil size={15} /> {t('Editar', 'Edit')}
                          </button>
                          <button type="button" className="ds-btn ds-btn--outline ds-btn--sm" disabled={ocupado === e.id} onClick={() => alternar(e)}>
                            {e.activo ? <><EyeOff size={15} /> {t('Dar de baja', 'Deactivate')}</> : <><Eye size={15} /> {t('Reactivar', 'Reactivate')}</>}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {formulario && <FormularioEquipo equipo={formulario.equipo} onCerrar={() => setFormulario(null)} onGuardado={guardado} />}
    </div>
  );
}
