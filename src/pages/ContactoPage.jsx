import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Clock, ExternalLink, Instagram, Mail, MapPin, Navigation, Phone, Send } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import FieldError from '../components/common/FieldError';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { enviarSolicitud } from '../services/contactoService';
import { useIdioma } from '../i18n/IdiomaContext';
import { useCatalogo, useEmpresa } from '../i18n/datos';
import { mensajeError } from '../i18n/errores';

const VACIO = { nombre: '', empresa: '', correo: '', telefono: '', embarcacion: '', interes: '', mensaje: '' };

export default function ContactoPage() {
  const { t, idioma } = useIdioma();
  const { CONTACTO } = useEmpresa();
  const { CATEGORIAS, PRODUCTOS } = useCatalogo();
  useDocumentTitle(
    t('Contacto', 'Contact'),
    t('Solicita una cotización o asesoría técnica en equipos electrónicos marinos.', 'Request a quote or technical advice on marine electronic equipment.'),
  );

  const [params] = useSearchParams();
  const productoInicial = params.get('producto');
  const producto = PRODUCTOS.find((p) => p.slug === productoInicial);

  const [datos, setDatos] = useState({
    ...VACIO,
    interes: producto ? producto.categoria : '',
    mensaje: producto ? t(`Quisiera cotizar el equipo ${producto.nombre}. `, `I would like a quote for the ${producto.nombre}. `) : '',
  });
  const [errores, setErrores] = useState({});
  const [estado, setEstado] = useState({ tipo: null, texto: '' });
  const [enviando, setEnviando] = useState(false);

  const cambiar = (e) => {
    const { name, value } = e.target;
    setDatos((d) => ({ ...d, [name]: value }));
    if (errores[name]) setErrores((x) => ({ ...x, [name]: null }));
  };

  const validar = () => {
    const e = {};
    if (!datos.nombre.trim()) e.nombre = t('Indícanos tu nombre.', 'Please enter your name.');
    if (!datos.correo.trim()) e.correo = t('Necesitamos un correo para responderte.', 'We need an email address to reply to you.');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo)) e.correo = t('Revisa el formato del correo.', 'Please check the email format.');
    if (datos.telefono && !/^[+\d\s()-]{7,20}$/.test(datos.telefono)) e.telefono = t('Revisa el número ingresado.', 'Please check the phone number.');
    if (!datos.mensaje.trim()) e.mensaje = t('Cuéntanos brevemente qué necesitas.', 'Briefly tell us what you need.');
    else if (datos.mensaje.trim().length < 12) e.mensaje = t('Danos un poco más de detalle.', 'Please give us a little more detail.');
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const enviar = async (ev) => {
    ev.preventDefault();
    setEstado({ tipo: null, texto: '' });
    if (!validar()) return;

    setEnviando(true);
    try {
      await enviarSolicitud({ ...datos, productoSlug: productoInicial ?? null });
      setEstado({ tipo: 'ok', texto: t('Recibimos tu consulta. Te responderemos dentro de las próximas 24 a 48 horas hábiles.', 'We have received your inquiry. We will reply within the next 24 to 48 business hours.') });
      setDatos(VACIO);
    } catch (err) {
      setEstado({
        tipo: 'err',
        texto: t(
          `${mensajeError(err, idioma)} Si el problema persiste, llámanos al ${CONTACTO.fijo.label}.`,
          `${mensajeError(err, idioma)} If the problem persists, call us at ${CONTACTO.fijo.label}.`,
        ),
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow={t('Contacto', 'Contact')}
        titulo={t('Consulta por tu equipo', 'Ask about your equipment')}
        descripcion={t(
          'Asesoría técnica, cotización e instalación a bordo. Mientras más datos nos entregues sobre la embarcación y la faena, más precisa será la propuesta.',
          'Technical advice, quotes and on-board installation. The more details you give us about the vessel and its operation, the more accurate our proposal will be.',
        )}
        migas={[{ label: t('Contacto', 'Contact') }]}
      />

      <section className="ds-section">
        <div className="ds-container">
          <div className="contact__layout">
            <div className="ds-card contact__form">
              <h2 className="ds-display ds-h3" style={{ marginBottom: 10 }}>{t('Escríbenos', 'Write to us')}</h2>
              <p style={{ color: 'var(--ink-soft)', marginBottom: 26, fontSize: '.95rem' }}>
                {t('Los campos marcados con', 'Fields marked with')} <span style={{ color: 'var(--err)' }}>*</span> {t('son obligatorios.', 'are required.')}
              </p>

              {estado.tipo && (
                <div className={`ds-alert ds-alert--${estado.tipo}`} role="status">{estado.texto}</div>
              )}

              <form onSubmit={enviar} noValidate>
                <div className="field-row">
                  <div className={`field${errores.nombre ? ' field--err' : ''}`}>
                    <label htmlFor="nombre">{t('Nombre', 'Name')} <span className="req">*</span></label>
                    <input id="nombre" name="nombre" value={datos.nombre} onChange={cambiar}
                      autoComplete="name" aria-invalid={Boolean(errores.nombre)} aria-describedby="err-nombre" />
                    <FieldError mensaje={errores.nombre} id="err-nombre" />
                  </div>
                  <div className="field">
                    <label htmlFor="empresa">{t('Empresa o armador', 'Company or shipowner')}</label>
                    <input id="empresa" name="empresa" value={datos.empresa} onChange={cambiar} autoComplete="organization" />
                  </div>
                </div>

                <div className="field-row">
                  <div className={`field${errores.correo ? ' field--err' : ''}`}>
                    <label htmlFor="correo">{t('Correo', 'Email')} <span className="req">*</span></label>
                    <input id="correo" name="correo" type="email" value={datos.correo} onChange={cambiar}
                      autoComplete="email" aria-invalid={Boolean(errores.correo)} aria-describedby="err-correo" />
                    <FieldError mensaje={errores.correo} id="err-correo" />
                  </div>
                  <div className={`field${errores.telefono ? ' field--err' : ''}`}>
                    <label htmlFor="telefono">{t('Teléfono', 'Phone')}</label>
                    <input id="telefono" name="telefono" type="tel" value={datos.telefono} onChange={cambiar}
                      autoComplete="tel" placeholder="+56 9 ..." aria-describedby="err-telefono" />
                    <FieldError mensaje={errores.telefono} id="err-telefono" />
                  </div>
                </div>

                <div className="field-row">
                  <div className="field">
                    <label htmlFor="embarcacion">{t('Embarcación', 'Vessel')}</label>
                    <input id="embarcacion" name="embarcacion" value={datos.embarcacion} onChange={cambiar}
                      placeholder={t('Nombre, eslora o tipo de faena', 'Name, length or type of operation')} />
                  </div>
                  <div className="field">
                    <label htmlFor="interes">{t('Línea de interés', 'Area of interest')}</label>
                    <select id="interes" name="interes" value={datos.interes} onChange={cambiar}>
                      <option value="">{t('Selecciona una opción', 'Select an option')}</option>
                      {CATEGORIAS.map((c) => <option value={c.slug} key={c.slug}>{c.nombre}</option>)}
                      <option value="servicio">{t('Servicio técnico o mantención', 'Technical service or maintenance')}</option>
                      <option value="otro">{t('Otro', 'Other')}</option>
                    </select>
                  </div>
                </div>

                <div className={`field${errores.mensaje ? ' field--err' : ''}`}>
                  <label htmlFor="mensaje">{t('Mensaje', 'Message')} <span className="req">*</span></label>
                  <textarea id="mensaje" name="mensaje" value={datos.mensaje} onChange={cambiar}
                    placeholder={t('Cuéntanos qué equipo buscas o qué problema necesitas resolver.', 'Tell us what equipment you are looking for or what problem you need to solve.')}
                    aria-invalid={Boolean(errores.mensaje)} aria-describedby="err-mensaje" />
                  <FieldError mensaje={errores.mensaje} id="err-mensaje" />
                </div>

                <button type="submit" className="ds-btn ds-btn--primary" disabled={enviando}>
                  {enviando ? t('Enviando…', 'Sending…') : <>{t('Enviar consulta', 'Send inquiry')} <Send size={17} /></>}
                </button>
              </form>
            </div>

            <div className="contact__aside">
              <div className="ds-card contact__block">
                <h3>{t('Datos de contacto', 'Contact details')}</h3>
                <div className="contact__item">
                  <Phone size={19} />
                  <span><b>{t('Oficina', 'Office')}</b><a href={`tel:${CONTACTO.fijo.tel}`}>{CONTACTO.fijo.label}</a></span>
                </div>
                {CONTACTO.ejecutivos.map((e) => (
                  <div className="contact__item" key={e.tel}>
                    <Phone size={19} />
                    <span><b>{e.nombre}</b><a href={`tel:${e.tel}`}>{e.label}</a></span>
                  </div>
                ))}
                <div className="contact__item">
                  <Mail size={19} />
                  <span><b>{t('Correo', 'Email')}</b><a href={`mailto:${CONTACTO.correo}`}>{CONTACTO.correo}</a></span>
                </div>
                <div className="contact__item">
                  <Instagram size={19} />
                  <span><b>Instagram</b>
                    <a href={CONTACTO.instagram.url} target="_blank" rel="noreferrer noopener">{CONTACTO.instagram.usuario}</a>
                  </span>
                </div>
                <div className="contact__item">
                  <Clock size={19} />
                  <span><b>{t('Horario', 'Opening hours')}</b>{CONTACTO.horario}</span>
                </div>
                <div className="contact__item">
                  <MapPin size={19} />
                  <span><b>{t('Dirección', 'Address')}</b>
                    <a href={CONTACTO.mapa.ficha} target="_blank" rel="noreferrer noopener">
                      {CONTACTO.direccion}, {CONTACTO.ciudad}
                    </a>
                  </span>
                </div>
              </div>

              {/* Mapa de Google embebido: se carga sólo al acercarse a él (loading="lazy")
                  y se sirve desde Google, sin consumir ancho de banda de Render. */}
              <div className="contact__map">
                <iframe
                  title={t(`Mapa: ${CONTACTO.direccion}, ${CONTACTO.ciudad}`, `Map: ${CONTACTO.direccion}, ${CONTACTO.ciudad}`)}
                  src={`${CONTACTO.mapa.embed}&hl=${idioma}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
              <div className="contact__map-actions">
                <a className="ds-btn ds-btn--primary ds-btn--sm" href={CONTACTO.mapa.ruta} target="_blank" rel="noreferrer noopener">
                  <Navigation size={16} /> {t('Cómo llegar', 'Get directions')}
                </a>
                <a className="ds-btn ds-btn--outline ds-btn--sm" href={CONTACTO.mapa.ficha} target="_blank" rel="noreferrer noopener">
                  <ExternalLink size={16} /> {t('Ver en Google Maps', 'Open in Google Maps')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
