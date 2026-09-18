import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import EmptyState from '../components/common/EmptyState';
import FiltrosCatalogo from '../features/catalogo/FiltrosCatalogo';
import ProductoCard from '../features/catalogo/ProductoCard';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { CATEGORIAS, MARCAS, PRODUCTOS, nombreCategoria, nombreMarca } from '../data/catalogo';

const listaDesde = (valor) => (valor ? valor.split(',').filter(Boolean) : []);

export default function ProductosPage() {
  useDocumentTitle('Productos', 'Catálogo de equipos electrónicos marinos: pesca, navegación, comunicaciones, seguridad y accesorios.');

  const [params, setParams] = useSearchParams();
  const categorias = listaDesde(params.get('categoria'));
  const marcas = listaDesde(params.get('marca'));
  const [busqueda, setBusqueda] = useState(params.get('q') ?? '');
  const [orden, setOrden] = useState('destacados');

  // Sincroniza el texto de búsqueda con la URL, sin golpear en cada tecla.
  useEffect(() => {
    const t = setTimeout(() => {
      const p = new URLSearchParams(params);
      if (busqueda) p.set('q', busqueda); else p.delete('q');
      setParams(p, { replace: true });
    }, 280);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busqueda]);

  const alternar = (tipo, valor) => {
    const actuales = tipo === 'categoria' ? categorias : marcas;
    const nuevos = actuales.includes(valor)
      ? actuales.filter((v) => v !== valor)
      : [...actuales, valor];
    const p = new URLSearchParams(params);
    if (nuevos.length) p.set(tipo, nuevos.join(',')); else p.delete(tipo);
    setParams(p, { replace: true });
  };

  const limpiar = () => {
    const p = new URLSearchParams();
    if (busqueda) p.set('q', busqueda);
    setParams(p, { replace: true });
  };

  const conteos = useMemo(() => {
    const porCategoria = {}; const porMarca = {};
    CATEGORIAS.forEach((c) => { porCategoria[c.slug] = PRODUCTOS.filter((p) => p.categoria === c.slug).length; });
    MARCAS.forEach((m) => { porMarca[m.slug] = PRODUCTOS.filter((p) => p.marca === m.slug).length; });
    return { categoria: porCategoria, marca: porMarca };
  }, []);

  const resultados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    let lista = PRODUCTOS.filter((p) => {
      if (categorias.length && !categorias.includes(p.categoria)) return false;
      if (marcas.length && !marcas.includes(p.marca)) return false;
      if (q) {
        const texto = `${p.nombre} ${p.resumen} ${p.subcategoria} ${nombreMarca(p.marca)}`.toLowerCase();
        if (!texto.includes(q)) return false;
      }
      return true;
    });

    if (orden === 'nombre') lista = [...lista].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
    if (orden === 'completos') lista = [...lista].sort((a, b) => Number(b.completo) - Number(a.completo));
    if (orden === 'destacados') lista = [...lista].sort((a, b) => Number(b.destacado) - Number(a.destacado));
    return lista;
  }, [categorias, marcas, busqueda, orden]);

  const activos = [
    ...categorias.map((c) => ({ tipo: 'categoria', valor: c, label: nombreCategoria(c) })),
    ...marcas.map((m) => ({ tipo: 'marca', valor: m, label: nombreMarca(m) })),
  ];

  return (
    <>
      <PageHeader
        eyebrow="Catálogo"
        titulo="Productos"
        descripcion="Equipos electrónicos marinos para pesca, navegación, comunicaciones y seguridad. Filtra por línea de producto o por marca."
        migas={[{ label: 'Productos' }]}
      />

      <section className="ds-section">
        <div className="ds-container">
          <div className="cat__layout">
            <FiltrosCatalogo
              categorias={categorias}
              marcas={marcas}
              conteos={conteos}
              onToggle={alternar}
              onReset={limpiar}
            />

            <div>
              <div className="cat__search">
                <div className="cat__searchbox">
                  <Search size={18} aria-hidden="true" />
                  <input
                    type="search"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar por modelo, tipo de equipo o marca…"
                    aria-label="Buscar en el catálogo"
                  />
                </div>
                <select
                  className="cat__sort"
                  value={orden}
                  onChange={(e) => setOrden(e.target.value)}
                  aria-label="Ordenar resultados"
                >
                  <option value="destacados">Destacados primero</option>
                  <option value="completos">Fichas completas primero</option>
                  <option value="nombre">Nombre (A-Z)</option>
                </select>
              </div>

              <div className="cat__meta">
                <span>
                  <strong>{resultados.length}</strong> {resultados.length === 1 ? 'equipo' : 'equipos'}
                  {activos.length > 0 && ' con los filtros aplicados'}
                </span>
                {activos.length > 0 && (
                  <div className="cat__active">
                    {activos.map((a) => (
                      <button
                        type="button"
                        className="cat__activechip"
                        key={`${a.tipo}-${a.valor}`}
                        onClick={() => alternar(a.tipo, a.valor)}
                      >
                        {a.label} <X size={13} aria-hidden="true" />
                        <span className="ds-sr-only">Quitar filtro</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {resultados.length === 0 ? (
                <EmptyState
                  titulo="Sin resultados"
                  mensaje="No encontramos equipos con esos criterios. Prueba con otros filtros o escríbenos: podemos conseguir el equipo que necesitas."
                >
                  <button type="button" className="ds-btn ds-btn--outline ds-btn--sm" onClick={limpiar}>
                    Limpiar filtros
                  </button>
                </EmptyState>
              ) : (
                <div className="ds-grid ds-grid--3">
                  {resultados.map((p) => <ProductoCard producto={p} key={p.id} />)}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
