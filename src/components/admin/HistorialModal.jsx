import { useEffect, useState } from 'react';
import Modal from './Modal';
import LoadingScreen from '../common/LoadingScreen';
import { historialInventario } from '../../services/adminService';
import { useIdioma } from '../../i18n/IdiomaContext';
import { mensajeError } from '../../i18n/errores';

const ETIQUETA = {
  ENTRADA: { es: 'Entrada', en: 'In', clase: 'on' },
  SALIDA: { es: 'Salida', en: 'Out', clase: 'err' },
  AJUSTE: { es: 'Ajuste', en: 'Adjust', clase: 'off' },
};

/** Últimos movimientos de un equipo, con quién los hizo. */
export default function HistorialModal({ item, onCerrar }) {
  const { t, idioma } = useIdioma();
  const [movs, setMovs] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let vigente = true;
    historialInventario(item.productoId)
      .then((d) => { if (vigente) setMovs(Array.isArray(d) ? d : []); })
      .catch((err) => { if (vigente) setError(mensajeError(err, idioma, { contexto: 'panel' })); });
    return () => { vigente = false; };
  }, [item.productoId, idioma]);

  const fecha = (iso) => new Date(iso).toLocaleString(idioma === 'en' ? 'en-US' : 'es-CL', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <Modal onCerrar={onCerrar} idTitulo="hist-titulo" ancho="ancho" titulo={(
      <>
        <span className="ds-tag">{t('Historial de stock', 'Stock history')}</span>
        <h2 id="hist-titulo" className="ds-display">{item.nombre}</h2>
      </>
    )}>
      {error && <div className="ds-alert ds-alert--err" role="alert">{error}</div>}
      {!error && movs === null && <LoadingScreen mensaje={t('Cargando historial', 'Loading history')} />}
      {movs && movs.length === 0 && <p className="adm-ayuda">{t('Todavía no hay movimientos registrados para este equipo.', 'No movements recorded for this item yet.')}</p>}
      {movs && movs.length > 0 && (
        <div className="adm-scroll">
          <table className="admin__table adm-hist">
            <thead>
              <tr>
                <th>{t('Fecha', 'Date')}</th><th>{t('Tipo', 'Type')}</th><th>{t('Cantidad', 'Qty')}</th>
                <th>{t('Quedó en', 'Result')}</th><th>{t('Motivo', 'Reason')}</th><th>{t('Quién', 'By')}</th>
              </tr>
            </thead>
            <tbody>
              {movs.map((m) => {
                const e = ETIQUETA[m.tipo] ?? { es: m.tipo, en: m.tipo, clase: 'off' };
                return (
                  <tr key={m.id}>
                    <td>{fecha(m.fecha)}</td>
                    <td><span className={`admin__state admin__state--${e.clase}`}>{idioma === 'en' ? e.en : e.es}</span></td>
                    <td>{m.cantidad}</td>
                    <td><strong>{m.stockResultante}</strong></td>
                    <td>{m.motivo || '—'}</td>
                    <td className="adm-hist__quien">{m.usuario}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <p className="adm-ayuda">{t('Se muestran los últimos 50 movimientos. El historial no se puede editar ni borrar.', 'The last 50 movements are shown. The history cannot be edited or deleted.')}</p>
      <div className="adm-modal__acciones">
        <button type="button" className="ds-btn ds-btn--primary" onClick={onCerrar}>{t('Cerrar', 'Close')}</button>
      </div>
    </Modal>
  );
}
