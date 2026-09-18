import { CATEGORIAS, MARCAS } from '../../data/catalogo';

export default function FiltrosCatalogo({ categorias, marcas, onToggle, onReset, conteos }) {
  const hayFiltros = categorias.length > 0 || marcas.length > 0;

  return (
    <aside className="ds-card filters" aria-label="Filtros del catálogo">
      <div className="filters__group">
        <h4>Categoría</h4>
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
        <h4>Marca</h4>
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
          Limpiar filtros
        </button>
      )}
    </aside>
  );
}
