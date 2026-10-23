import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Inbox, KeyRound, Package, RefreshCw, Warehouse, X } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import LoadingScreen from '../components/common/LoadingScreen';
import BienvenidaPerfil from '../components/auth/BienvenidaPerfil';
import ClaveObligatoria from '../components/admin/ClaveObligatoria';
import SolicitudesPanel from '../components/admin/SolicitudesPanel';
import InventarioPanel from '../components/admin/InventarioPanel';
import CatalogoAdminPanel from '../components/admin/CatalogoAdminPanel';
import CuentaPanel from '../components/admin/CuentaPanel';
import { useAuth } from '../context/useAuth';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useInactividad } from '../hooks/useInactividad';
import { useNoIndex } from '../hooks/useNoIndex';
import { listarEquipos, listarInventario, listarSolicitudes } from '../services/adminService';
import { useIdioma } from '../i18n/IdiomaContext';
import { mensajeError } from '../i18n/errores';
import { estadoStock } from '../utils/inventario';

const MINUTOS_INACTIVIDAD = 30;

const PESTANAS = [
  { id: 'solicitudes', label: { es: 'Mensajes de clientes', en: 'Client messages' }, icono: Inbox },
  { id: 'inventario', label: { es: 'Inventario', en: 'Inventory' }, icono: Warehouse },
  { id: 'catalogo', label: { es: 'Catálogo', en: 'Catalog' }, icono: Package },
  { id: 'cuenta', label: { es: 'Mi cuenta', en: 'My account' }, icono: KeyRound },
];

const NOMBRE_DATO = {
  solicitudes: { es: 'los mensajes', en: 'the messages' },
  inventario: { es: 'el inventario', en: 'the inventory' },
  equipos: { es: 'el catálogo', en: 'the catalog' },
};

export default function AdminPage() {
  const { t, idioma } = useIdioma();
  const { usuario, cerrarSesion } = useAuth();
  useDocumentTitle(t('Panel de administración', 'Admin panel'));
  useNoIndex();
  useInactividad(MINUTOS_INACTIVIDAD, cerrarSesion);

  const [pestana, setPestana] = useState('solicitudes');
  const [solicitudes, setSolicitudes] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [fallidos, setFallidos] = useState({}); // { solicitudes: 'mensaje', ... }
  const [aviso, setAviso] = useState('');
  const vigente = useRef(true);

  const cargar = useCallback(async () => {
    setCargando(true);
    setAviso('');
    const [s, i, e] = await Promise.allSettled([listarSolicitudes(), listarInventario(), listarEquipos()]);
    if (!vigente.current) return;
    const nuevos = {};
    const tomar = (resultado, clave, poner) => {
      if (resultado.status === 'fulfilled') poner(Array.isArray(resultado.value) ? resultado.value : []);
      else nuevos[clave] = mensajeError(resultado.reason, idioma, { contexto: 'panel' });
    };
    tomar(s, 'solicitudes', setSolicitudes);
    tomar(i, 'inventario', setInventario);
    tomar(e, 'equipos', setEquipos);
    setFallidos(nuevos);
    setCargando(false);
  }, [idioma]);

  useEffect(() => {
    vigente.current = true;
    cargar();
    return () => { vigente.current = false; };
  }, [cargar]);

  // Un equipo nuevo necesita su fila de inventario: se vuelve a pedir el inventario sin tapar la pantalla.
  const recargarInventario = useCallback(() => {
    listarInventario().then((d) => { if (vigente.current && Array.isArray(d)) setInventario(d); }).catch(() => {});
  }, []);

  const pendientes = useMemo(() => solicitudes.filter((s) => !s.atendida).length, [solicitudes]);
  const alertasStock = useMemo(() => inventario.filter((i) => i.activo && estadoStock(i) !== 'ok').length, [inventario]);
  const insignia = { solicitudes: pendientes, inventario: alertasStock };

  const teclasPestana = (e, indice) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const sig = (indice + (e.key === 'ArrowRight' ? 1 : PESTANAS.length - 1)) % PESTANAS.length;
    setPestana(PESTANAS[sig].id);
    document.getElementById(`tab-${PESTANAS[sig].id}`)?.focus();
  };

  const clavesFallidas = Object.keys(fallidos);

  return (
    <>
      <ClaveObligatoria />
      {!usuario?.claveInicial && <BienvenidaPerfil />}
      <PageHeader
        eyebrow={t('Interno', 'Internal')}
        titulo={t('Panel de administración', 'Admin panel')}
        descripcion={t('Mensajes de clientes, inventario de stock y equipos del catálogo.', 'Client messages, stock inventory and catalog equipment.')}
        migas={[{ label: t('Panel', 'Admin') }]}
      />

      <section className="ds-section">
        <div className="ds-container">
          <div className="admin__tabs" role="tablist" aria-label={t('Secciones del panel', 'Panel sections')}>
            {PESTANAS.map(({ id, label, icono: Icono }, indice) => (
              <button
                key={id}
                id={`tab-${id}`}
                type="button"
                role="tab"
                aria-selected={pestana === id}
                aria-controls={`panel-${id}`}
                tabIndex={pestana === id ? 0 : -1}
                className={`admin__tab${pestana === id ? ' is-active' : ''}`}
                onClick={() => setPestana(id)}
                onKeyDown={(e) => teclasPestana(e, indice)}
              >
                <Icono size={16} className="admin__tab-icono" aria-hidden="true" />
                {label[idioma === 'en' ? 'en' : 'es']}
                {insignia[id] > 0 && <span className="admin__insignia" aria-label={t(`${insignia[id]} por revisar`, `${insignia[id]} to review`)}>{insignia[id]}</span>}
              </button>
            ))}
            <button type="button" className="admin__tab admin__tab--accion" onClick={cargar} disabled={cargando}>
              <RefreshCw size={16} className="admin__tab-icono" aria-hidden="true" />
              {t('Actualizar', 'Refresh')}
            </button>
          </div>

          {clavesFallidas.length > 0 && (
            <div className="ds-alert ds-alert--err" role="alert">
              {t('No se pudo cargar', 'Could not load')}{' '}
              {clavesFallidas.map((k) => NOMBRE_DATO[k][idioma === 'en' ? 'en' : 'es']).join(', ')}. {fallidos[clavesFallidas[0]]}{' '}
              <button type="button" className="adm-enlace" onClick={cargar}>{t('Reintentar', 'Try again')}</button>
            </div>
          )}
          {aviso && (
            <div className="ds-alert ds-alert--err adm-aviso" role="alert">
              <span>{aviso}</span>
              <button type="button" className="adm-aviso__cerrar" onClick={() => setAviso('')} aria-label={t('Cerrar aviso', 'Dismiss')}><X size={16} /></button>
            </div>
          )}

          {cargando
            ? <LoadingScreen mensaje={t('Cargando datos', 'Loading data')} />
            : (
              <div role="tabpanel" id={`panel-${pestana}`} aria-labelledby={`tab-${pestana}`} tabIndex={0}>
                {pestana === 'solicitudes' && !fallidos.solicitudes && (
                  <SolicitudesPanel solicitudes={solicitudes} setSolicitudes={setSolicitudes} onError={setAviso} />
                )}
                {pestana === 'inventario' && !fallidos.inventario && (
                  <InventarioPanel items={inventario} setItems={setInventario} onError={setAviso} />
                )}
                {pestana === 'catalogo' && !fallidos.equipos && (
                  <CatalogoAdminPanel equipos={equipos} setEquipos={setEquipos} onError={setAviso} alCrear={recargarInventario} />
                )}
                {pestana === 'cuenta' && <CuentaPanel />}
              </div>
            )}
        </div>
      </section>
    </>
  );
}
