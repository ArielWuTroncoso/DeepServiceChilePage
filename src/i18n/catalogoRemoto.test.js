import { describe, expect, it } from 'vitest';
import { desdeRespuesta, normalizar } from './catalogoRemoto';

const LOCALES = ['furuno-fcv-800', 'radio-vhf'];

describe('desdeRespuesta', () => {
  it('oculta los dados de baja y agrega solo los equipos que el sitio no trae', () => {
    const r = desdeRespuesta({
      activos: [
        { id: 1, slug: 'furuno-fcv-800', nombre: 'FCV-800', marca: 'furuno', categoria: 'pesca' },
        { id: 99, slug: 'nuevo-equipo', nombre: 'Nuevo', marca: 'icom', categoria: 'comunicaciones', imagenUrl: '/productos/x/01.webp',
          especificaciones: [{ clave: 'A', valor: 'B' }] },
      ],
      ocultos: ['radio-vhf'],
    }, LOCALES);
    expect(r.ocultos).toEqual(['radio-vhf']);
    expect(r.nuevos).toHaveLength(1);
    expect(r.nuevos[0]).toMatchObject({ slug: 'nuevo-equipo', imagen: '/productos/x/01.webp', completo: false, chips: [], destacados: [] });
    expect(r.nuevos[0].galeria).toEqual([{ src: '/productos/x/01.webp', alt: 'Nuevo' }]);
  });
  it('un equipo nuevo sin foto no rompe la ficha', () => {
    const r = desdeRespuesta({ activos: [{ id: 5, slug: 'sin-foto', nombre: 'S', marca: 'icom', categoria: 'seguridad' }], ocultos: [] }, LOCALES);
    expect(r.nuevos[0]).toMatchObject({ imagen: null, galeria: [], especificaciones: [], resumen: '', subcategoria: '' });
  });
  it('ante una respuesta que no es la esperada deja el catálogo propio', () => {
    expect(desdeRespuesta('<html></html>', LOCALES)).toEqual({ ocultos: [], nuevos: [] });
    expect(desdeRespuesta(null, LOCALES)).toEqual({ ocultos: [], nuevos: [] });
    expect(desdeRespuesta({ activos: 1, ocultos: [] }, LOCALES)).toEqual({ ocultos: [], nuevos: [] });
  });
});

describe('normalizar (lo guardado en el navegador)', () => {
  it('descarta lo que no tiene la forma esperada', () => {
    expect(normalizar({ ocultos: ['a', 3, null], nuevos: [{ slug: 'x', nombre: 'X' }, { slug: 1 }, null] }))
      .toEqual({ ocultos: ['a'], nuevos: [{ slug: 'x', nombre: 'X' }] });
    expect(normalizar('basura')).toEqual({ ocultos: [], nuevos: [] });
    expect(normalizar({ ocultos: 'x', nuevos: [] })).toEqual({ ocultos: [], nuevos: [] });
  });
});
