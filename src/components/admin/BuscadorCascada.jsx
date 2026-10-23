import { ChevronRight, FilterX, Search } from 'lucide-react';
import { useIdioma } from '../../i18n/IdiomaContext';
import { useCatalogo } from '../../i18n/datos';
import { ajustarSeleccion, opcionesCascada } from '../../utils/inventario';

export const BUSQUEDA_VACIA = { categoria: '', marca: '', producto: '', texto: '' };

/**
 * Buscador del panel: un cuadro de texto y tres listas encadenadas.
 *   Categoría → Marca → Equipo
 * Cada lista solo ofrece lo que existe dentro de lo ya elegido, y si se cambia una de arriba
 * las de abajo que dejaron de corresponder se limpian solas.
 *
 * `items` necesita: productoId, nombre, categoria, marca. `children` se dibuja junto al botón de limpiar.
 */
export default function BuscadorCascada({ items, valor, onCambiar, idPrefijo = 'bc', children }) {
  const { t } = useIdioma();
  const { nombreCategoria, nombreMarca } = useCatalogo();
  const { categorias, marcas, equipos } = opcionesCascada(items, valor, { categoria: nombreCategoria, marca: nombreMarca });

  const elegir = (campo, v) => onCambiar({ ...ajustarSeleccion(items, { ...valor, [campo]: v }), texto: valor.texto });
  const hayFiltro = Boolean(valor.categoria || valor.marca || valor.producto || valor.texto);

  return (
    <div className="adm-buscador">
      <label className="adm-buscar adm-buscar--ancho" htmlFor={`${idPrefijo}-texto`}>
        <Search size={17} aria-hidden="true" />
        <span className="ds-sr-only">{t('Buscar equipo por nombre', 'Search equipment by name')}</span>
        <input id={`${idPrefijo}-texto`} type="search" value={valor.texto} maxLength={80}
          onChange={(e) => onCambiar({ ...valor, texto: e.target.value })}
          placeholder={t('Buscar equipo por nombre, tipo o marca', 'Search equipment by name, type or brand')} />
      </label>

      <div className="adm-cascada">
        <div className="field">
          <label htmlFor={`${idPrefijo}-cat`}>{t('1. Categoría', '1. Category')}</label>
          <select id={`${idPrefijo}-cat`} value={valor.categoria} onChange={(e) => elegir('categoria', e.target.value)}>
            <option value="">{t('Todas las categorías', 'All categories')}</option>
            {categorias.map((c) => <option key={c.valor} value={c.valor}>{c.etiqueta} ({c.total})</option>)}
          </select>
        </div>
        <ChevronRight size={18} className="adm-cascada__flecha" aria-hidden="true" />
        <div className="field">
          <label htmlFor={`${idPrefijo}-marca`}>{t('2. Marca', '2. Brand')}</label>
          <select id={`${idPrefijo}-marca`} value={valor.marca} onChange={(e) => elegir('marca', e.target.value)}>
            <option value="">{valor.categoria ? t('Todas las marcas de la categoría', 'All brands in the category') : t('Todas las marcas', 'All brands')}</option>
            {marcas.map((m) => <option key={m.valor} value={m.valor}>{m.etiqueta} ({m.total})</option>)}
          </select>
        </div>
        <ChevronRight size={18} className="adm-cascada__flecha" aria-hidden="true" />
        <div className="field">
          <label htmlFor={`${idPrefijo}-equipo`}>{t('3. Equipo', '3. Equipment')}</label>
          <select id={`${idPrefijo}-equipo`} value={valor.producto} onChange={(e) => elegir('producto', e.target.value)}>
            <option value="">{t('Todos los equipos', 'All equipment')} ({equipos.length})</option>
            {equipos.map((e) => <option key={e.valor} value={e.valor}>{e.etiqueta}</option>)}
          </select>
        </div>
      </div>

      <div className="adm-buscador__pie">
        {children}
        <button type="button" className="ds-btn ds-btn--outline ds-btn--sm" disabled={!hayFiltro}
          onClick={() => onCambiar(BUSQUEDA_VACIA)}>
          <FilterX size={16} /> {t('Limpiar filtros', 'Clear filters')}
        </button>
      </div>
    </div>
  );
}
