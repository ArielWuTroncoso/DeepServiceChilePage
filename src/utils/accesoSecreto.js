/**
 * Entrada discreta al área de administradores: la tecla ↑ seguida de la tecla ↓.
 *
 * Es solo una puerta de entrada para no mostrar enlaces de acceso a los clientes;
 * la seguridad real está en el backend (código de autorización y JWT).
 */
export const SECUENCIA_ACCESO = ['ArrowUp', 'ArrowDown'];
export const VENTANA_MS = 1200;   // tiempo máximo entre la primera y la última tecla

function esCampoDeEdicion(el) {
  if (!el || !el.tagName) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable === true;
}

/**
 * Crea el manejador de `keydown`. Ignora teclas mantenidas, combinaciones con
 * modificadores y cualquier tecla pulsada mientras se escribe en un campo
 * (donde ↑ y ↓ tienen otro uso).
 */
export function crearDetectorAcceso(alAcceder, {
  secuencia = SECUENCIA_ACCESO,
  ventanaMs = VENTANA_MS,
  ahora = () => Date.now(),
} = {}) {
  let avance = 0;
  let inicio = 0;

  return (e) => {
    if (e.repeat || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || esCampoDeEdicion(e.target)) {
      avance = 0;
      return;
    }

    const t = ahora();
    if (avance > 0 && t - inicio > ventanaMs) avance = 0;

    if (e.key === secuencia[avance]) {
      if (avance === 0) inicio = t;
      avance += 1;
      if (avance === secuencia.length) {
        avance = 0;
        alAcceder();
      }
    } else if (e.key === secuencia[0]) {
      avance = 1;
      inicio = t;
    } else {
      avance = 0;
    }
  };
}
