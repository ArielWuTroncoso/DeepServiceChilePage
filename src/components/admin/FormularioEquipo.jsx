import { useState } from 'react';
import Modal from './Modal';
import FieldError from '../common/FieldError';
import { crearEquipo, actualizarEquipo } from '../../services/adminService';
import { useIdioma } from '../../i18n/IdiomaContext';
import { useCatalogo, SLUGS_LOCALES } from '../../i18n/datos';
import { detallesError, mensajeError } from '../../i18n/errores';
import { especificacionesATexto, generarSlug, parsearEspecificaciones, validarEquipo } from '../../utils/inventario';

const NUEVO = {
  nombre: '', slug: '', categoria: '', marca: '', subcategoria: '', resumen: '', descripcion: '',
  imagenUrl: '', destacado: false, completo: false, activo: true, especificaciones: '',
};

function desdeEquipo(e) {
  return {
    nombre: e.nombre ?? '', slug: e.slug ?? '', categoria: e.categoria ?? '', marca: e.marca ?? '',
    subcategoria: e.subcategoria ?? '', resumen: e.resumen ?? '', descripcion: e.descripcion ?? '',
    imagenUrl: e.imagenUrl ?? '', destacado: Boolean(e.destacado), completo: Boolean(e.completo),
    activo: e.activo !== false, especificaciones: especificacionesATexto(e.especificaciones ?? []),
  };
}

/** Alta y edición de un equipo. El identificador no se puede cambiar una vez creado. */
export default function FormularioEquipo({ equipo, onCerrar, onGuardado }) {
  const { t, idioma } = useIdioma();
  const { CATEGORIAS, MARCAS } = useCatalogo();
  const editando = Boolean(equipo);
  const [f, setF] = useState(() => (equipo ? desdeEquipo(equipo) : NUEVO));
  const [slugManual, setSlugManual] = useState(false);
  const [errores, setErrores] = useState({});
  const [aviso, setAviso] = useState({ texto: '', detalles: [] });
  const [enviando, setEnviando] = useState(false);

  const conFichaEnSitio = editando && SLUGS_LOCALES.includes(equipo.slug);

  const cambiar = (e) => {
    const { name, value, type, checked } = e.target;
    setF((x) => {
      const nuevo = { ...x, [name]: type === 'checkbox' ? checked : value };
      if (name === 'nombre' && !editando && !slugManual) nuevo.slug = generarSlug(value);
      return nuevo;
    });
    if (errores[name]) setErrores((x) => ({ ...x, [name]: null }));
  };

  const enviar = async (ev) => {
    ev.preventDefault();
    setAviso({ texto: '', detalles: [] });
    const e = validarEquipo(f);
    setErrores(e);
    if (Object.keys(e).length > 0) return;

    const cuerpo = {
      slug: f.slug.trim(),
      nombre: f.nombre.trim(),
      subcategoria: f.subcategoria.trim() || null,
      resumen: f.resumen.trim() || null,
      descripcion: f.descripcion.trim() || null,
      imagenUrl: f.imagenUrl.trim() || null,
      categoria: f.categoria,
      marca: f.marca,
      destacado: f.destacado,
      completo: f.completo,
      activo: f.activo,
      especificaciones: parsearEspecificaciones(f.especificaciones),
    };
    setEnviando(true);
    try {
      const guardado = await (editando ? actualizarEquipo(equipo.id, cuerpo) : crearEquipo(cuerpo));
      onGuardado(guardado, !editando);
      onCerrar();
    } catch (err) {
      setAviso({ texto: mensajeError(err, idioma, { contexto: 'panel' }), detalles: detallesError(err, idioma) });
    } finally {
      setEnviando(false);
    }
  };

  const campoError = (nombre) => <FieldError mensaje={errores[nombre]} id={`eq-err-${nombre}`} />;

  return (
    <Modal onCerrar={onCerrar} idTitulo="eq-titulo" ancho="ancho" titulo={(
      <>
        <span className="ds-tag">{editando ? t('Editar equipo', 'Edit equipment') : t('Nuevo equipo', 'New equipment')}</span>
        <h2 id="eq-titulo" className="ds-display">{editando ? equipo.nombre : t('Agregar al catálogo', 'Add to the catalog')}</h2>
      </>
    )}>
      <form onSubmit={enviar} noValidate>
        {conFichaEnSitio && (
          <div className="ds-alert ds-alert--info" role="note">
            {t(
              'Este equipo ya tiene su ficha propia en el sitio (fotos, textos y especificaciones verificadas). Aquí puedes cambiarlo en el panel y darlo de baja, pero los textos de esa ficha pública no cambian desde esta pantalla.',
              'This item already has its own page on the website (photos, texts and verified specs). You can edit it here and deactivate it, but the public page texts are not changed from this screen.',
            )}
          </div>
        )}
        {aviso.texto && (
          <div className="ds-alert ds-alert--err" role="alert">
            {aviso.texto}
            {aviso.detalles.length > 0 && <ul className="ds-alert__lista">{aviso.detalles.map((d) => <li key={d}>{d}</li>)}</ul>}
          </div>
        )}

        <div className="field-row">
          <div className={`field${errores.nombre ? ' field--err' : ''}`}>
            <label htmlFor="eq-nombre">{t('Nombre del equipo', 'Equipment name')} <span className="req">*</span></label>
            <input id="eq-nombre" name="nombre" value={f.nombre} onChange={cambiar} maxLength={160} aria-invalid={Boolean(errores.nombre)} aria-describedby="eq-err-nombre" />
            {campoError('nombre')}
          </div>
          <div className={`field${errores.slug ? ' field--err' : ''}`}>
            <label htmlFor="eq-slug">{t('Identificador (en el enlace)', 'Identifier (in the link)')} <span className="req">*</span></label>
            <input id="eq-slug" name="slug" value={f.slug} maxLength={140} readOnly={editando}
              onChange={(e) => { setSlugManual(true); cambiar(e); }} aria-invalid={Boolean(errores.slug)} aria-describedby="eq-err-slug" />
            {campoError('slug')}
            {editando && <span className="adm-ayuda">{t('No se puede cambiar: los enlaces del sitio dependen de él.', 'It cannot be changed: site links depend on it.')}</span>}
          </div>
        </div>

        <div className="field-row">
          <div className={`field${errores.categoria ? ' field--err' : ''}`}>
            <label htmlFor="eq-categoria">{t('Categoría', 'Category')} <span className="req">*</span></label>
            <select id="eq-categoria" name="categoria" value={f.categoria} onChange={cambiar} aria-invalid={Boolean(errores.categoria)} aria-describedby="eq-err-categoria">
              <option value="">{t('Selecciona una categoría', 'Select a category')}</option>
              {CATEGORIAS.map((c) => <option key={c.slug} value={c.slug}>{c.nombre}</option>)}
            </select>
            {campoError('categoria')}
          </div>
          <div className={`field${errores.marca ? ' field--err' : ''}`}>
            <label htmlFor="eq-marca">{t('Marca', 'Brand')} <span className="req">*</span></label>
            <select id="eq-marca" name="marca" value={f.marca} onChange={cambiar} aria-invalid={Boolean(errores.marca)} aria-describedby="eq-err-marca">
              <option value="">{t('Selecciona una marca', 'Select a brand')}</option>
              {MARCAS.map((m) => <option key={m.slug} value={m.slug}>{m.nombre}</option>)}
            </select>
            {campoError('marca')}
          </div>
        </div>

        <div className="field">
          <label htmlFor="eq-sub">{t('Tipo de equipo', 'Equipment type')}</label>
          <input id="eq-sub" name="subcategoria" value={f.subcategoria} onChange={cambiar} maxLength={120}
            placeholder={t('Ej.: Sonda de pesca, Radar, Radiotelefono', 'E.g. Fish finder, Radar, Radiotelephone')} />
        </div>
        <div className="field">
          <label htmlFor="eq-resumen">{t('Resumen (una o dos frases)', 'Summary (one or two sentences)')}</label>
          <textarea id="eq-resumen" name="resumen" value={f.resumen} onChange={cambiar} maxLength={600} rows={2} />
        </div>
        <div className="field">
          <label htmlFor="eq-desc">{t('Descripción', 'Description')}</label>
          <textarea id="eq-desc" name="descripcion" value={f.descripcion} onChange={cambiar} maxLength={4000} rows={4} />
        </div>
        <div className="field">
          <label htmlFor="eq-esp">{t('Especificaciones', 'Specifications')}</label>
          <textarea id="eq-esp" name="especificaciones" value={f.especificaciones} onChange={cambiar} rows={5}
            placeholder={'Pantalla: 8,4" color\nAlimentación: 12 - 24 V CC'} />
          <span className="adm-ayuda">{t('Una por línea, con el formato “Característica: valor”.', 'One per line, in the format “Feature: value”.')}</span>
        </div>
        <div className={`field${errores.imagenUrl ? ' field--err' : ''}`}>
          <label htmlFor="eq-img">{t('Imagen', 'Image')}</label>
          <input id="eq-img" name="imagenUrl" value={f.imagenUrl} onChange={cambiar} maxLength={500} inputMode="url"
            placeholder="/productos/mi-equipo/01.webp" aria-invalid={Boolean(errores.imagenUrl)} aria-describedby="eq-err-imagenUrl" />
          {campoError('imagenUrl')}
          <span className="adm-ayuda">{t('Ruta de una imagen del sitio o dirección https. Déjalo vacío si aún no hay foto.', 'Path of a site image or an https address. Leave empty if there is no photo yet.')}</span>
        </div>

        <div className="adm-checks">
          <label className="adm-check"><input type="checkbox" name="activo" checked={f.activo} onChange={cambiar} /> {t('Visible en el sitio', 'Visible on the website')}</label>
          <label className="adm-check"><input type="checkbox" name="destacado" checked={f.destacado} onChange={cambiar} /> {t('Destacado', 'Featured')}</label>
          <label className="adm-check"><input type="checkbox" name="completo" checked={f.completo} onChange={cambiar} /> {t('Ficha completa (verificada)', 'Complete page (verified)')}</label>
        </div>

        <div className="adm-modal__acciones">
          <button type="button" className="ds-btn ds-btn--outline" onClick={onCerrar}>{t('Cancelar', 'Cancel')}</button>
          <button type="submit" className="ds-btn ds-btn--primary" disabled={enviando}>
            {enviando ? t('Guardando…', 'Saving…') : (editando ? t('Guardar cambios', 'Save changes') : t('Crear equipo', 'Create equipment'))}
          </button>
        </div>
      </form>
    </Modal>
  );
}
