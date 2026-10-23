import { useEffect, useRef } from 'react';

const EVENTOS = ['pointerdown', 'keydown', 'scroll', 'touchstart'];

/**
 * Cierra la sesión del panel tras un rato sin actividad, para que un computador
 * dejado abierto no deje los datos a la vista.
 */
export function useInactividad(minutos, alExpirar) {
  const callback = useRef(alExpirar);
  useEffect(() => { callback.current = alExpirar; }, [alExpirar]);

  useEffect(() => {
    const limite = minutos * 60 * 1000;
    let ultima = Date.now();
    const marcar = () => { ultima = Date.now(); };
    EVENTOS.forEach((e) => window.addEventListener(e, marcar, { passive: true }));

    // Se revisa cada 15 s con la hora real: así también cuenta el tiempo con el equipo suspendido.
    const revisor = setInterval(() => {
      if (Date.now() - ultima >= limite) callback.current();
    }, 15000);

    return () => {
      clearInterval(revisor);
      EVENTOS.forEach((e) => window.removeEventListener(e, marcar));
    };
  }, [minutos]);
}
