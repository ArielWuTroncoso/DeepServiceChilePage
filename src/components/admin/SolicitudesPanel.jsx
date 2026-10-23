import { useMemo, useState } from 'react';
import { Building2, ChevronDown, Clock, ExternalLink, Inbox, Mail, MessageSquare, Phone, RotateCcw, Check, Ship, Search } from 'lucide-react';
import EmptyState from '../common/EmptyState';
import { marcarAtendida, reabrirSolicitud } from '../../services/adminService';
import { useIdioma } from '../../i18n/IdiomaContext';
import { useCatalogo } from '../../i18n/datos';
import { mensajeError } from '../../i18n/errores';
import { normalizar } from '../../utils/inventario';
import { enlaceCorreo, enlaceTelefono } from '../../utils/enlaces';

const FILTROS = [
  { id: 'todas', es: 'Todas', en: 'All' },
  { id: 'pendientes', es: 'Pendientes', en: 'Pending' },
  { id: 'atendidas', es: 'Atendidas', en: 'Handled' },
];

/** Bandeja de mensajes enviados por clientes desde el formulario de contacto. */
export default function SolicitudesPanel({ solicitudes, setSolicitudes, onError }) {
  const { t, idioma } = useIdioma();
  const { nombreCategoria, PRODUCTOS } = useCatalogo();
  const [filtro, setFiltro] = useState('pendientes');
  const [texto, setTexto] = useState('');
  const [abierta, setAbierta] = useState(null);
  const [ocupada, setOcupada] = useState(null);

  const pendientes = solicitudes.filter((s) => !s.atendida).length;

  const visibles = useMemo(() => {
    const q = normalizar(texto);
    return solicitudes.filter((s) => {
      if (filtro === 'pendientes' && s.atendida) return false;
      if (filtro === 'atendidas' && !s.atendida) return false;
      if (!q) return true;
      return normalizar(`${s.nombre} ${s.empresa ?? ''} ${s.correo} ${s.telefono ?? ''} ${s.embarcacion ?? ''} ${s.mensaje}`).includes(q);
    });
  }, [solicitudes, filtro, texto]);

  const fechaCorta = (iso) => (iso
    ? new Date(iso).toLocaleString(idioma === 'en' ? 'en-US' : 'es-CL', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '—');

  const interes = (valor) => {
    if (!valor) return null;
    if (valor === 'servicio') return t('Servicio técnico o mantención', 'Technical service or maintenance');
    if (valor === 'otro') return t('Otro', 'Other');
    return nombreCategoria(valor);
  };

  const cambiarEstado = async (s, atender) => {
    setOcupada(s.id);
    try {
      const actualizada = await (atender ? marcarAtendida(s.id) : reabrirSolicitud(s.id));
      setSolicitudes((lista) => lista.map((x) => (x.id === s.id ? { ...x, ...actualizada } : x)));
    } catch (err) {
      onError(mensajeError(err, idioma, { contexto: 'panel' }));
    } finally {
      setOcupada(null);
    }
  };

  return (
    <div>
      <div className="adm-barra">
        <div className="adm-filtros" role="group" aria-label={t('Filtrar por estado', 'Filter by status')}>
          {FILTROS.map((f) => (
            <button key={f.id} type="button" className={`adm-filtro${filtro === f.id ? ' is-active' : ''}`}
              aria-pressed={filtro === f.id} onClick={() => setFiltro(f.id)}>
              {f[idioma === 'en' ? 'en' : 'es']}
              {f.id === 'pendientes' && pendientes > 0 && <span className="adm-filtro__n">{pendientes}</span>}
            </button>
          ))}
        </div>
        <label className="adm-buscar">
          <Search size={17} aria-hidden="true" />
          <span className="ds-sr-only">{t('Buscar en los mensajes', 'Search messages')}</span>
          <input type="search" value={texto} onChange={(e) => setTexto(e.target.value)} maxLength={80}
            placeholder={t('Buscar por nombre, correo o mensaje', 'Search by name, email or message')} />
        </label>
      </div>

      <p className="adm-contador" aria-live="polite">
        {t(`${visibles.length} de ${solicitudes.length} mensajes`, `${visibles.length} of ${solicitudes.length} messages`)}
      </p>

      {solicitudes.length === 0 && (
        <EmptyState icono={Inbox} titulo={t('Sin mensajes todavía', 'No messages yet')}
          mensaje={t('Las consultas enviadas desde el formulario de contacto del sitio aparecerán aquí.', 'Inquiries sent through the website contact form will appear here.')} />
      )}
      {solicitudes.length > 0 && visibles.length === 0 && (
        <EmptyState icono={Search} titulo={t('Nada con ese filtro', 'Nothing matches')}
          mensaje={t('Prueba con otro estado o borra la búsqueda.', 'Try another status or clear the search.')} />
      )}

      <ul className="adm-msgs">
        {visibles.map((s) => {
          const esAbierta = abierta === s.id;
          const producto = s.productoSlug ? PRODUCTOS.find((p) => p.slug === s.productoSlug) : null;
          const idMsg = `msg-${s.id}`;
          return (
            <li key={s.id} className={`adm-msg${s.atendida ? '' : ' is-pendiente'}${esAbierta ? ' is-abierto' : ''}`}>
              <button type="button" className="adm-msg__cab" aria-expanded={esAbierta} aria-controls={idMsg}
                onClick={() => setAbierta(esAbierta ? null : s.id)}>
                <span className="adm-msg__quien">
                  <strong>{s.nombre}</strong>
                  <span className={`admin__state admin__state--${s.atendida ? 'on' : 'warn'}`}>
                    {s.atendida ? t('Atendida', 'Handled') : t('Pendiente', 'Pending')}
                  </span>
                </span>
                <span className="adm-msg__fecha"><Clock size={14} aria-hidden="true" /> {fechaCorta(s.fechaCreacion)}</span>
                {!esAbierta && <span className="adm-msg__vista">{s.mensaje}</span>}
                <ChevronDown size={18} className="adm-msg__flecha" aria-hidden="true" />
              </button>

              {esAbierta && (
                <div className="adm-msg__cuerpo" id={idMsg}>
                  <div className="adm-msg__texto">
                    <span className="adm-etiqueta"><MessageSquare size={14} aria-hidden="true" /> {t('Mensaje', 'Message')}</span>
                    <p>{s.mensaje}</p>
                  </div>

                  <dl className="adm-datos">
                    <div><dt><Mail size={14} aria-hidden="true" /> {t('Correo', 'Email')}</dt>
                      <dd>{enlaceCorreo(s.correo) ? <a href={enlaceCorreo(s.correo)}>{s.correo}</a> : s.correo}</dd></div>
                    {s.telefono && <div><dt><Phone size={14} aria-hidden="true" /> {t('Teléfono', 'Phone')}</dt>
                      <dd>{enlaceTelefono(s.telefono) ? <a href={enlaceTelefono(s.telefono)}>{s.telefono}</a> : s.telefono}</dd></div>}
                    {s.empresa && <div><dt><Building2 size={14} aria-hidden="true" /> {t('Empresa', 'Company')}</dt><dd>{s.empresa}</dd></div>}
                    {s.embarcacion && <div><dt><Ship size={14} aria-hidden="true" /> {t('Embarcación', 'Vessel')}</dt><dd>{s.embarcacion}</dd></div>}
                    {interes(s.interes) && <div><dt>{t('Línea de interés', 'Area of interest')}</dt><dd>{interes(s.interes)}</dd></div>}
                    {s.productoSlug && <div><dt>{t('Equipo consultado', 'Equipment asked about')}</dt>
                      <dd>{producto ? <a href={`/productos/${producto.slug}`} target="_blank" rel="noreferrer noopener">{producto.nombre} <ExternalLink size={12} aria-hidden="true" /></a> : s.productoSlug}</dd></div>}
                  </dl>

                  <div className="adm-msg__acciones">
                    {enlaceCorreo(s.correo) && (
                      <a className="ds-btn ds-btn--primary ds-btn--sm"
                        href={enlaceCorreo(s.correo, t('Respuesta a tu consulta · Deep Service Chile', 'Reply to your inquiry · Deep Service Chile'))}>
                        <Mail size={16} /> {t('Responder por correo', 'Reply by email')}
                      </a>
                    )}
                    {s.atendida ? (
                      <button type="button" className="ds-btn ds-btn--outline ds-btn--sm" disabled={ocupada === s.id} onClick={() => cambiarEstado(s, false)}>
                        <RotateCcw size={16} /> {t('Volver a pendiente', 'Mark as pending')}
                      </button>
                    ) : (
                      <button type="button" className="ds-btn ds-btn--outline ds-btn--sm" disabled={ocupada === s.id} onClick={() => cambiarEstado(s, true)}>
                        <Check size={16} /> {t('Marcar atendida', 'Mark as handled')}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
