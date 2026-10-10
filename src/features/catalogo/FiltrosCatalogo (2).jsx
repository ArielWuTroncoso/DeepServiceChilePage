import { useIdioma } from '../../i18n/IdiomaContext';
import { useCatalogo } from '../../i18n/datos';

export default function FiltrosCatalogo({ categorias, marcas, onToggle, onReset, conteos }) {
  const { t } = useIdioma();
  const { CATEGORIAS, MARCAS } = useCatalogo();
  const hayFiltros = categorias.length > 0 || marcas.length > 0;

  return (
    <aside className="ds-card filters" aria-label={t('Filtros del catálogo', 'Catalog filters')}>
      <div className="filters__group">
        <h4>{t('Categoría', 'Category')}</h4>
        {CATEGORIAS.map((c) => (
          <label className="filters__opt" key={c.slug}>
            <input
              type="checkbox"
              checked={categorias.includes(c.slug)}
              onChange={() => onToggle('categoria', c.slug)}
            />
            <span>{c.nombre}</span>
            <em>{conteos.categoria[c.slug] ?? 0}</em>
          </label>
        ))}
      </div>

      <div className="filters__group">
        <h4>{t('Marca', 'Brand')}</h4>
        {MARCAS.map((m) => (
          <label className="filters__opt" key={m.slug}>
            <input
              type="checkbox"
              checked={marcas.includes(m.slug)}
              onChange={() => onToggle('marca', m.slug)}
            />
            <span>{m.nombre}</span>
            <em>{conteos.marca[m.slug] ?? 0}</em>
          </label>
        ))}
      </div>

      {hayFiltros && (
        <button type="button" className="ds-btn ds-btn--outline ds-btn--sm filters__reset" onClick={onReset}>
          {t('Limpiar filtros', 'Clear filters')}
        </button>
      )}
    </aside>
  );
}
