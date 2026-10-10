import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import EmptyState from '../components/common/EmptyState';
import FiltrosCatalogo from '../features/catalogo/FiltrosCatalogo';
import ProductoCard from '../features/catalogo/ProductoCard';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useIdioma } from '../i18n/IdiomaContext';
import { useCatalogo } from '../i18n/datos';

const listaDesde = (valor) => (valor ? valor.split(',').filter(Boolean) : []);

export default function ProductosPage() {
  const { t, idioma } = useIdioma();
  const { CATEGORIAS, MARCAS, PRODUCTOS, nombreCategoria, nombreMarca } = useCatalogo();
  useDocumentTitle(
    t('Productos', 'Products'),
    t('Catálogo de equipos electrónicos marinos: pesca, navegación, comunicaciones, seguridad y accesorios.',
      'Catalog of marine electronic equipment: fishing, navigation, communications, safety and accessories.'),
  );

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
  }, [CATEGORIAS, MARCAS, PRODUCTOS]);

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

    if (orden === 'nombre') lista = [...lista].sort((a, b) => a.nombre.localeCompare(b.nombre, idioma));
    if (orden === 'completos') lista = [...lista].sort((a, b) => Number(b.completo) - Number(a.completo));
    if (orden === 'destacados') lista = [...lista].sort((a, b) => Number(b.destacado) - Number(a.destacado));
    return lista;
  }, [categorias, marcas, busqueda, orden, PRODUCTOS, nombreMarca, idioma]);

  const activos = [
    ...categorias.map((c) => ({ tipo: 'categoria', valor: c, label: nombreCategoria(c) })),
    ...marcas.map((m) => ({ tipo: 'marca', valor: m, label: nombreMarca(m) })),
  ];

  return (
    <>
      <PageHeader
        eyebrow={t('Catálogo', 'Catalog')}
        titulo={t('Productos', 'Products')}
        descripcion={t(
          'Equipos electrónicos marinos para pesca, navegación, comunicaciones y seguridad. Filtra por línea de producto o por marca.',
          'Marine electronic equipment for fishing, navigation, communications and safety. Filter by product line or by brand.',
        )}
        migas={[{ label: t('Productos', 'Products') }]}
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
                    placeholder={t('Buscar por modelo, tipo de equipo o marca…', 'Search by model, equipment type or brand…')}
                    aria-label={t('Buscar en el catálogo', 'Search the catalog')}
                  />
                </div>
                <select
                  className="cat__sort"
                  value={orden}
                  onChange={(e) => setOrden(e.target.value)}
                  aria-label={t('Ordenar resultados', 'Sort results')}
                >
                  <option value="destacados">{t('Destacados primero', 'Featured first')}</option>
                  <option value="completos">{t('Fichas completas primero', 'Full specs first')}</option>
                  <option value="nombre">{t('Nombre (A-Z)', 'Name (A–Z)')}</option>
                </select>
              </div>

              <div className="cat__meta">
                <span>
                  <strong>{resultados.length}</strong> {resultados.length === 1 ? t('equipo', 'item') : t('equipos', 'items')}
                  {activos.length > 0 && t(' con los filtros aplicados', ' with the selected filters')}
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
                        <span className="ds-sr-only">{t('Quitar filtro', 'Remove filter')}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {resultados.length === 0 ? (
                <EmptyState
                  titulo={t('Sin resultados', 'No results')}
                  mensaje={t(
                    'No encontramos equipos con esos criterios. Prueba con otros filtros o escríbenos: podemos conseguir el equipo que necesitas.',
                    'We found no equipment matching those criteria. Try other filters or write to us: we can source the equipment you need.',
                  )}
                >
                  <button type="button" className="ds-btn ds-btn--outline ds-btn--sm" onClick={limpiar}>
                    {t('Limpiar filtros', 'Clear filters')}
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
