import { useState } from 'react';
import { ArrowDownToLine, ArrowUpFromLine, SlidersHorizontal } from 'lucide-react';
import Modal from './Modal';
import { actualizarMinimo, registrarMovimiento } from '../../services/adminService';
import { useIdioma } from '../../i18n/IdiomaContext';
import { detallesError, mensajeError } from '../../i18n/errores';
import { stockResultante } from '../../utils/inventario';

const TIPOS = [
  { id: 'ENTRADA', icono: ArrowDownToLine, es: 'Entrada', en: 'Stock in', ayudaEs: 'Llegan unidades (compra, devolución).', ayudaEn: 'Units arrive (purchase, return).' },
  { id: 'SALIDA', icono: ArrowUpFromLine, es: 'Salida', en: 'Stock out', ayudaEs: 'Salen unidades (venta, instalación).', ayudaEn: 'Units leave (sale, installation).' },
  { id: 'AJUSTE', icono: SlidersHorizontal, es: 'Fijar total', en: 'Set total', ayudaEs: 'Corrige el stock al número contado.', ayudaEn: 'Correct the stock to the counted number.' },
];

/** Registra un movimiento de stock (entrada, salida o ajuste) y permite definir el mínimo de alerta. */
export default function MovimientoModal({ item, onCerrar, onActualizado }) {
  const { t, idioma } = useIdioma();
  const en = idioma === 'en';
  const [tipo, setTipo] = useState('ENTRADA');
  const [cantidad, setCantidad] = useState('1');
  const [motivo, setMotivo] = useState('');
  const [minimo, setMinimo] = useState(String(item.stockMinimo));
  const [enviando, setEnviando] = useState(false);
  const [guardandoMin, setGuardandoMin] = useState(false);
  const [aviso, setAviso] = useState({ tipo: null, texto: '', detalles: [] });

  const resultante = stockResultante(item.stock, tipo, cantidad);
  const excede = tipo === 'SALIDA' && /^\d+$/.test(String(cantidad).trim()) && Number(cantidad) > item.stock;
  const actual = TIPOS.find((x) => x.id === tipo);

  const fallo = (err) => setAviso({ tipo: 'err', texto: mensajeError(err, idioma, { contexto: 'panel' }), detalles: detallesError(err, idioma) });

  const enviar = async (ev) => {
    ev.preventDefault();
    setAviso({ tipo: null, texto: '', detalles: [] });
    if (resultante === null) {
      setAviso({ tipo: 'err', texto: excede
        ? t(`Solo hay ${item.stock} unidades: no se pueden retirar ${cantidad}.`, `Only ${item.stock} units in stock: cannot remove ${cantidad}.`)
        : t('Escribe una cantidad entera de 0 o más.', 'Enter a whole number of 0 or more.'), detalles: [] });
      return;
    }
    if (tipo !== 'AJUSTE' && Number(cantidad) === 0) {
      setAviso({ tipo: 'err', texto: t('La cantidad debe ser mayor que cero.', 'The quantity must be greater than zero.'), detalles: [] });
      return;
    }
    setEnviando(true);
    try {
      const actualizado = await registrarMovimiento(item.productoId, { tipo, cantidad: Number(cantidad), motivo: motivo.trim() });
      onActualizado(actualizado);
      onCerrar();
    } catch (err) {
      fallo(err);
    } finally {
      setEnviando(false);
    }
  };

  const guardarMinimo = async () => {
    setAviso({ tipo: null, texto: '', detalles: [] });
    const n = Number(minimo);
    if (!Number.isInteger(n) || n < 0) {
      setAviso({ tipo: 'err', texto: t('El mínimo debe ser un número entero de 0 o más.', 'The minimum must be a whole number of 0 or more.'), detalles: [] });
      return;
    }
    setGuardandoMin(true);
    try {
      const actualizado = await actualizarMinimo(item.productoId, n);
      onActualizado(actualizado);
      setAviso({ tipo: 'ok', texto: t('Mínimo guardado.', 'Minimum saved.'), detalles: [] });
    } catch (err) {
      fallo(err);
    } finally {
      setGuardandoMin(false);
    }
  };

  return (
    <Modal onCerrar={onCerrar} idTitulo="mov-titulo" ancho="ancho" titulo={(
      <>
        <span className="ds-tag">{t('Movimiento de stock', 'Stock movement')}</span>
        <h2 id="mov-titulo" className="ds-display">{item.nombre}</h2>
        <p>{t('Stock actual:', 'Current stock:')} <strong>{item.stock}</strong> {t('unidades', 'units')}</p>
      </>
    )}>
      <form onSubmit={enviar} noValidate>
        {aviso.tipo && (
          <div className={`ds-alert ds-alert--${aviso.tipo}`} role={aviso.tipo === 'err' ? 'alert' : 'status'}>
            {aviso.texto}
            {aviso.detalles.length > 0 && <ul className="ds-alert__lista">{aviso.detalles.map((d) => <li key={d}>{d}</li>)}</ul>}
          </div>
        )}

        <fieldset className="adm-tipos">
          <legend className="ds-sr-only">{t('Tipo de movimiento', 'Movement type')}</legend>
          {TIPOS.map(({ id, icono: Icono, es, en: enL }) => (
            <label key={id} className={`adm-tipo${tipo === id ? ' is-active' : ''}`}>
              <input type="radio" name="tipo" value={id} checked={tipo === id} data-foco-inicial={id === 'ENTRADA' ? '' : undefined}
                onChange={() => { setTipo(id); setAviso({ tipo: null, texto: '', detalles: [] }); }} />
              <Icono size={18} aria-hidden="true" /> {en ? enL : es}
            </label>
          ))}
        </fieldset>
        <p className="adm-ayuda">{en ? actual.ayudaEn : actual.ayudaEs}</p>

        <div className="field-row">
          <div className="field">
            <label htmlFor="mov-cantidad">{tipo === 'AJUSTE' ? t('Total contado', 'Counted total') : t('Cantidad', 'Quantity')}</label>
            <input id="mov-cantidad" type="number" inputMode="numeric" min="0" max="1000000" step="1" value={cantidad}
              onChange={(e) => setCantidad(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="mov-motivo">{t('Motivo (opcional)', 'Reason (optional)')}</label>
            <input id="mov-motivo" value={motivo} maxLength={200} onChange={(e) => setMotivo(e.target.value)}
              placeholder={t('Ej.: compra a proveedor', 'E.g. supplier purchase')} />
          </div>
        </div>

        <p className={`adm-prevista${resultante === null ? ' is-err' : ''}`} aria-live="polite">
          {resultante === null
            ? (excede ? t('No hay stock suficiente para esa salida.', 'Not enough stock for that removal.') : t('Cantidad no válida.', 'Invalid quantity.'))
            : <>{t('Quedará en', 'It will be')} <strong>{resultante}</strong> {t('unidades', 'units')}</>}
        </p>

        <div className="adm-modal__acciones">
          <button type="button" className="ds-btn ds-btn--outline" onClick={onCerrar}>{t('Cancelar', 'Cancel')}</button>
          <button type="submit" className="ds-btn ds-btn--primary" disabled={enviando || resultante === null}>
            {enviando ? t('Guardando…', 'Saving…') : t('Registrar movimiento', 'Record movement')}
          </button>
        </div>
      </form>

      <div className="adm-minimo">
        <div className="field">
          <label htmlFor="mov-minimo">{t('Alerta de stock bajo', 'Low-stock alert')}</label>
          <input id="mov-minimo" type="number" inputMode="numeric" min="0" max="1000000" step="1" value={minimo}
            onChange={(e) => setMinimo(e.target.value)} />
        </div>
        <button type="button" className="ds-btn ds-btn--outline ds-btn--sm" onClick={guardarMinimo} disabled={guardandoMin}>
          {guardandoMin ? t('Guardando…', 'Saving…') : t('Guardar mínimo', 'Save minimum')}
        </button>
        <p className="adm-ayuda">{t('Cuando el stock llega a este número o menos, el equipo aparece como “Stock bajo”. Con 0 no hay alerta.', 'When stock reaches this number or less, the item shows as “Low stock”. With 0 there is no alert.')}</p>
      </div>
    </Modal>
  );
}
