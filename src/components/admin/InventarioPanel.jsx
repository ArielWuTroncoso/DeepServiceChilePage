import { useMemo, useState } from 'react';
import { AlertTriangle, Boxes, History, Minus, PackageX, Plus, SlidersHorizontal, Warehouse } from 'lucide-react';
import EmptyState from '../common/EmptyState';
import BuscadorCascada, { BUSQUEDA_VACIA } from './BuscadorCascada';
import MovimientoModal from './MovimientoModal';
import HistorialModal from './HistorialModal';
import { registrarMovimiento } from '../../services/adminService';
import { useIdioma } from '../../i18n/IdiomaContext';
import { useCatalogo } from '../../i18n/datos';
import { mensajeError } from '../../i18n/errores';
import { estadoStock, filtrarInventario, resumenInventario } from '../../utils/inventario';

const LIMITE_STOCK = 1_000_000;

/** Existencias de cada equipo: sumar y restar unidades, ajustar, ver historial y fijar el mínimo. */
export default function InventarioPanel({ items, setItems, onError }) {
  const { t, idioma } = useIdioma();
  const { nombreCategoria, nombreMarca } = useCatalogo();
  const [busqueda, setBusqueda] = useState(BUSQUEDA_VACIA);
  const [soloBajo, setSoloBajo] = useState(false);
  const [ocupados, setOcupados] = useState(() => new Set());
  const [modal, setModal] = useState(null); // { tipo: 'mover' | 'historial', item }

  const visibles = useMemo(
    () => filtrarInventario(items, { ...busqueda, soloBajo }),
    [items, busqueda, soloBajo],
  );
  const resumen = useMemo(() => resumenInventario(items), [items]);

  const reemplazar = (nuevo) => setItems((lista) => lista.map((i) => (i.productoId === nuevo.productoId ? nuevo : i)));

  const sumarRestar = async (item, tipo) => {
    if (ocupados.has(item.productoId)) return;
    setOcupados((s) => new Set(s).add(item.productoId));
    try {
      reemplazar(await registrarMovimiento(item.productoId, { tipo, cantidad: 1 }));
    } catch (err) {
      onError(mensajeError(err, idioma, { contexto: 'panel' }));
    } finally {
      setOcupados((s) => { const n = new Set(s); n.delete(item.productoId); return n; });
    }
  };

  const etiqueta = (item) => {
    switch (estadoStock(item)) {
      case 'sin': return <span className="admin__state admin__state--err">{t('Agotado', 'Out of stock')}</span>;
      case 'bajo': return <span className="admin__state admin__state--warn">{t('Stock bajo', 'Low stock')}</span>;
      default: return <span className="admin__state admin__state--on">{t('Disponible', 'In stock')}</span>;
    }
  };

  if (items.length === 0) {
    return <EmptyState icono={Warehouse} titulo={t('Sin equipos en el inventario', 'No equipment in the inventory')}
      mensaje={t('Cuando el servidor tenga equipos cargados aparecerán aquí con su stock.', 'Once the server has equipment loaded it will appear here with its stock.')} />;
  }

  return (
    <div>
      <div className="adm-resumen">
        <div className="adm-resumen__item"><Boxes size={20} aria-hidden="true" /><strong>{resumen.equipos}</strong><span>{t('Equipos', 'Items')}</span></div>
        <div className="adm-resumen__item"><Warehouse size={20} aria-hidden="true" /><strong>{resumen.unidades}</strong><span>{t('Unidades en bodega', 'Units in stock')}</span></div>
        <div className="adm-resumen__item adm-resumen__item--warn"><AlertTriangle size={20} aria-hidden="true" /><strong>{resumen.bajo}</strong><span>{t('Stock bajo', 'Low stock')}</span></div>
        <div className="adm-resumen__item adm-resumen__item--err"><PackageX size={20} aria-hidden="true" /><strong>{resumen.sin}</strong><span>{t('Agotados', 'Out of stock')}</span></div>
      </div>

      <BuscadorCascada items={items} valor={busqueda} onCambiar={setBusqueda} idPrefijo="inv">
        <label className="adm-check">
          <input type="checkbox" checked={soloBajo} onChange={(e) => setSoloBajo(e.target.checked)} />
          {t('Solo stock bajo o agotado', 'Only low or out of stock')}
        </label>
      </BuscadorCascada>

      <p className="adm-contador" aria-live="polite">
        {t(`${visibles.length} de ${items.length} equipos`, `${visibles.length} of ${items.length} items`)}
      </p>

      {visibles.length === 0 ? (
        <EmptyState titulo={t('Ningún equipo coincide', 'No item matches')}
          mensaje={t('Cambia la categoría, la marca o el texto de búsqueda.', 'Change the category, brand or search text.')} />
      ) : (
        <div className="adm-scroll">
          <table className="admin__table adm-inv adm-tarjetas">
            <thead>
              <tr>
                <th>{t('Equipo', 'Equipment')}</th><th>{t('Estado', 'Status')}</th>
                <th className="adm-inv__colstock">{t('Stock', 'Stock')}</th><th className="adm-col-min">{t('Mínimo', 'Min.')}</th><th />
              </tr>
            </thead>
            <tbody>
              {visibles.map((i) => {
                const ocupado = ocupados.has(i.productoId);
                return (
                  <tr key={i.productoId} className={i.activo ? '' : 'is-baja'}>
                    <td>
                      <strong>{i.nombre}</strong>
                      {!i.activo && <span className="adm-baja">{t('Dado de baja', 'Deactivated')}</span>}
                      <br /><span className="adm-sub">{nombreMarca(i.marca)} · {nombreCategoria(i.categoria)}{i.subcategoria ? ` · ${i.subcategoria}` : ''}
                        {i.stockMinimo > 0 && <span className="adm-solo-movil"> · {t('mín.', 'min.')} {i.stockMinimo}</span>}</span>
                    </td>
                    <td>{etiqueta(i)}</td>
                    <td>
                      <div className="adm-stock" role="group" aria-label={t(`Stock de ${i.nombre}`, `Stock of ${i.nombre}`)}>
                        <button type="button" className="adm-stock__btn" onClick={() => sumarRestar(i, 'SALIDA')}
                          disabled={ocupado || i.stock <= 0} aria-label={t(`Restar una unidad a ${i.nombre}`, `Remove one unit of ${i.nombre}`)}>
                          <Minus size={16} />
                        </button>
                        <output className="adm-stock__n" aria-live="polite">{i.stock}</output>
                        <button type="button" className="adm-stock__btn" onClick={() => sumarRestar(i, 'ENTRADA')}
                          disabled={ocupado || i.stock >= LIMITE_STOCK} aria-label={t(`Sumar una unidad a ${i.nombre}`, `Add one unit of ${i.nombre}`)}>
                          <Plus size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="adm-inv__min adm-col-min">{i.stockMinimo > 0 ? i.stockMinimo : '—'}</td>
                    <td>
                      <div className="adm-fila-acciones">
                        <button type="button" className="ds-btn ds-btn--outline ds-btn--sm" onClick={() => setModal({ tipo: 'mover', item: i })}>
                          <SlidersHorizontal size={15} /> {t('Mover stock', 'Move stock')}
                        </button>
                        <button type="button" className="ds-btn ds-btn--outline ds-btn--sm" onClick={() => setModal({ tipo: 'historial', item: i })}>
                          <History size={15} /> {t('Historial', 'History')}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {modal?.tipo === 'mover' && (
        <MovimientoModal item={items.find((x) => x.productoId === modal.item.productoId) ?? modal.item}
          onCerrar={() => setModal(null)} onActualizado={reemplazar} />
      )}
      {modal?.tipo === 'historial' && <HistorialModal item={modal.item} onCerrar={() => setModal(null)} />}
    </div>
  );
}
