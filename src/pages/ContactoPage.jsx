import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Clock, Instagram, Mail, MapPin, Phone, Send } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import FieldError from '../components/common/FieldError';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { enviarSolicitud } from '../services/contactoService';
import { CONTACTO } from '../data/empresa';
import { CATEGORIAS, PRODUCTOS } from '../data/catalogo';

const VACIO = { nombre: '', empresa: '', correo: '', telefono: '', embarcacion: '', interes: '', mensaje: '' };

export default function ContactoPage() {
  useDocumentTitle('Contacto', 'Solicita una cotización o asesoría técnica en equipos electrónicos marinos.');

  const [params] = useSearchParams();
  const productoInicial = params.get('producto');
  const producto = PRODUCTOS.find((p) => p.slug === productoInicial);

  const [datos, setDatos] = useState({
    ...VACIO,
    interes: producto ? producto.categoria : '',
    mensaje: producto ? `Quisiera cotizar el equipo ${producto.nombre}. ` : '',
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
    if (!datos.nombre.trim()) e.nombre = 'Indícanos tu nombre.';
    if (!datos.correo.trim()) e.correo = 'Necesitamos un correo para responderte.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo)) e.correo = 'Revisa el formato del correo.';
    if (datos.telefono && !/^[+\d\s()-]{7,20}$/.test(datos.telefono)) e.telefono = 'Revisa el número ingresado.';
    if (!datos.mensaje.trim()) e.mensaje = 'Cuéntanos brevemente qué necesitas.';
    else if (datos.mensaje.trim().length < 12) e.mensaje = 'Danos un poco más de detalle.';
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
      setEstado({ tipo: 'ok', texto: 'Recibimos tu consulta. Te responderemos dentro de las próximas 24 a 48 horas hábiles.' });
      setDatos(VACIO);
    } catch (err) {
      setEstado({
        tipo: 'err',
        texto: `${err.message} Si el problema persiste, llámanos al ${CONTACTO.fijo.label}.`,
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Contacto"
        titulo="Consulta por tu equipo"
        descripcion="Asesoría técnica, cotización e instalación a bordo. Mientras más datos nos entregues sobre la embarcación y la faena, más precisa será la propuesta."
        migas={[{ label: 'Contacto' }]}
      />

      <section className="ds-section">
        <div className="ds-container">
          <div className="contact__layout">
            <div className="ds-card contact__form">
              <h2 className="ds-display ds-h3" style={{ marginBottom: 10 }}>Escríbenos</h2>
              <p style={{ color: 'var(--ink-soft)', marginBottom: 26, fontSize: '.95rem' }}>
                Los campos marcados con <span style={{ color: 'var(--err)' }}>*</span> son obligatorios.
              </p>

              {estado.tipo && (
                <div className={`ds-alert ds-alert--${estado.tipo}`} role="status">{estado.texto}</div>
              )}

              <form onSubmit={enviar} noValidate>
                <div className="field-row">
                  <div className={`field${errores.nombre ? ' field--err' : ''}`}>
                    <label htmlFor="nombre">Nombre <span className="req">*</span></label>
                    <input id="nombre" name="nombre" value={datos.nombre} onChange={cambiar}
                      autoComplete="name" aria-invalid={Boolean(errores.nombre)} aria-describedby="err-nombre" />
                    <FieldError mensaje={errores.nombre} id="err-nombre" />
                  </div>
                  <div className="field">
                    <label htmlFor="empresa">Empresa o armador</label>
                    <input id="empresa" name="empresa" value={datos.empresa} onChange={cambiar} autoComplete="organization" />
                  </div>
                </div>

                <div className="field-row">
                  <div className={`field${errores.correo ? ' field--err' : ''}`}>
                    <label htmlFor="correo">Correo <span className="req">*</span></label>
                    <input id="correo" name="correo" type="email" value={datos.correo} onChange={cambiar}
                      autoComplete="email" aria-invalid={Boolean(errores.correo)} aria-describedby="err-correo" />
                    <FieldError mensaje={errores.correo} id="err-correo" />
                  </div>
                  <div className={`field${errores.telefono ? ' field--err' : ''}`}>
                    <label htmlFor="telefono">Teléfono</label>
                    <input id="telefono" name="telefono" type="tel" value={datos.telefono} onChange={cambiar}
                      autoComplete="tel" placeholder="+56 9 ..." aria-describedby="err-telefono" />
                    <FieldError mensaje={errores.telefono} id="err-telefono" />
                  </div>
                </div>

                <div className="field-row">
                  <div className="field">
                    <label htmlFor="embarcacion">Embarcación</label>
                    <input id="embarcacion" name="embarcacion" value={datos.embarcacion} onChange={cambiar}
                      placeholder="Nombre, eslora o tipo de faena" />
                  </div>
                  <div className="field">
                    <label htmlFor="interes">Línea de interés</label>
                    <select id="interes" name="interes" value={datos.interes} onChange={cambiar}>
                      <option value="">Selecciona una opción</option>
                      {CATEGORIAS.map((c) => <option value={c.slug} key={c.slug}>{c.nombre}</option>)}
                      <option value="servicio">Servicio técnico o mantención</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                </div>

                <div className={`field${errores.mensaje ? ' field--err' : ''}`}>
                  <label htmlFor="mensaje">Mensaje <span className="req">*</span></label>
                  <textarea id="mensaje" name="mensaje" value={datos.mensaje} onChange={cambiar}
                    placeholder="Cuéntanos qué equipo buscas o qué problema necesitas resolver."
                    aria-invalid={Boolean(errores.mensaje)} aria-describedby="err-mensaje" />
                  <FieldError mensaje={errores.mensaje} id="err-mensaje" />
                </div>

                <button type="submit" className="ds-btn ds-btn--primary" disabled={enviando}>
                  {enviando ? 'Enviando…' : <>Enviar consulta <Send size={17} /></>}
                </button>
              </form>
            </div>

            <div className="contact__aside">
              <div className="ds-card contact__block">
                <h3>Datos de contacto</h3>
                <div className="contact__item">
                  <Phone size={19} />
                  <span><b>Oficina</b><a href={`tel:${CONTACTO.fijo.tel}`}>{CONTACTO.fijo.label}</a></span>
                </div>
                {CONTACTO.ejecutivos.map((e) => (
                  <div className="contact__item" key={e.tel}>
                    <Phone size={19} />
                    <span><b>{e.nombre}</b><a href={`tel:${e.tel}`}>{e.label}</a></span>
                  </div>
                ))}
                <div className="contact__item">
                  <Mail size={19} />
                  <span><b>Correo</b><a href={`mailto:${CONTACTO.correo}`}>{CONTACTO.correo}</a></span>
                </div>
                <div className="contact__item">
                  <Instagram size={19} />
                  <span><b>Instagram</b>
                    <a href={CONTACTO.instagram.url} target="_blank" rel="noreferrer noopener">{CONTACTO.instagram.usuario}</a>
                  </span>
                </div>
                <div className="contact__item">
                  <Clock size={19} />
                  <span><b>Horario</b>{CONTACTO.horario}</span>
                </div>
                <div className="contact__item">
                  <MapPin size={19} />
                  <span><b>Ubicación</b>{CONTACTO.ciudad}</span>
                </div>
              </div>

              <div className="contact__map">
                <MapPin size={32} strokeWidth={1.5} aria-hidden="true" />
                <b style={{ fontSize: '.8rem', letterSpacing: '.12em', textTransform: 'uppercase' }}>Mapa</b>
                <span style={{ fontSize: '.85rem', lineHeight: 1.5 }}>
                  Espacio reservado para el mapa de ubicación una vez confirmada la dirección.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
