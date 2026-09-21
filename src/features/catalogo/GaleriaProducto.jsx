import { useState } from 'react';
import { ImageOff } from 'lucide-react';

/**
 * Galería de la ficha: imagen principal + miniaturas.
 * `imagenes` = [{ src, alt, ajuste? }]. `ajuste: 'cubrir'` llena el marco
 * (pantallas, banners); por defecto la imagen se muestra completa, pensada
 * para fotos de producto recortadas sin fondo.
 */
export default function GaleriaProducto({ imagenes = [], nombre }) {
  const [activa, setActiva] = useState(0);

  if (!imagenes.length) {
    return (
      <div className="pdp__slot">
        <ImageOff size={40} strokeWidth={1.4} aria-hidden="true" />
        <b style={{ fontSize: '.82rem', letterSpacing: '.13em', textTransform: 'uppercase' }}>Imagen pendiente</b>
        <span style={{ fontSize: '.85rem', maxWidth: '30ch', lineHeight: 1.5 }}>
          Pronto agregaremos la fotografía oficial del equipo.
        </span>
      </div>
    );
  }

  const actual = imagenes[Math.min(activa, imagenes.length - 1)];

  return (
    <>
      <figure className={`pdp__main${actual.ajuste === 'cubrir' ? ' is-cubrir' : ''}`}>
        <img
          key={actual.src}
          src={actual.src}
          alt={actual.alt || nombre}
          decoding="async"
          fetchPriority={activa === 0 ? 'high' : 'auto'}
        />
      </figure>

      {imagenes.length > 1 && (
        <div className="pdp__thumbs" role="tablist" aria-label={`Imágenes de ${nombre}`}>
          {imagenes.map((img, i) => (
            <button
              type="button"
              role="tab"
              key={img.src}
              className={`pdp__thumb${i === activa ? ' is-on' : ''}${img.ajuste === 'cubrir' ? ' is-cubrir' : ''}`}
              aria-selected={i === activa}
              aria-label={img.alt || `Imagen ${i + 1}`}
              onClick={() => setActiva(i)}
            >
              <img src={img.src} alt="" loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
      )}
    </>
  );
}
