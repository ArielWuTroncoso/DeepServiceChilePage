import { Link } from 'react-router-dom';
import { ArrowRight, ImageOff } from 'lucide-react';
import { nombreCategoria, nombreMarca } from '../../data/catalogo';

export default function ProductoCard({ producto }) {
  const { slug, nombre, marca, categoria, subcategoria, resumen, completo, imagen, especificaciones = [] } = producto;

  return (
    <article className="ds-card ds-card--hover prod">
      <div className="prod__media">
        {imagen
          ? <img src={imagen} alt={nombre} loading="lazy" />
          : (<>
              <ImageOff size={30} strokeWidth={1.5} aria-hidden="true" />
              <span>Imagen pendiente</span>
            </>)}
        {!completo && <span className="ds-tag prod__flag">Ficha en preparación</span>}
      </div>

      <div className="prod__body">
        <span className="prod__brand">{nombreMarca(marca)}</span>
        <h3 className="prod__name">{nombre}</h3>
        <p className="prod__desc">{resumen}</p>

        {especificaciones.length > 0 && (
          <div className="prod__specs">
            {especificaciones.slice(0, 3).map((e) => (
              <span className="prod__spec" key={e.clave}>{e.valor}</span>
            ))}
          </div>
        )}

        <div className="prod__foot">
          <span className="prod__cat">{subcategoria || nombreCategoria(categoria)}</span>
          <Link to={`/productos/${slug}`} className="prod__link">
            Ver ficha <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}
