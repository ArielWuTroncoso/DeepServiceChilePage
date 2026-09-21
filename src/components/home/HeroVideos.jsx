import { useCallback, useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';

/**
 * Videos de portada: plóter GPS (horizontal) y sonar (vertical), montados
 * como dos pantallas superpuestas.
 *
 * Presupuesto de ancho de banda (plan Hobby de Render: 5 GB/mes):
 *   · Cada visitante descarga UNA versión de cada video: AV1/WebM (Chrome,
 *     Edge, Firefox) ≈ 1,8 MB en total, o H.264/MP4 (Safari) ≈ 2,3 MB.
 *   · Con el resto del sitio (~0,65 MB), el peor caso es ≈ 3 MB por visita
 *     nueva → unas 1.700 visitas nuevas al mes antes de llegar a 5 GB.
 *
 * Para gastar sólo cuando vale la pena:
 *   · `preload="none"`: al cargar la página sólo bajan los pósters (~28 KB c/u).
 *   · Los videos empiezan cuando el recuadro entra en pantalla y la página ya
 *     terminó de cargar; en móvil, quien no baja hasta ellos no los descarga.
 *   · Con "ahorro de datos", conexión 2G o "reducir movimiento" se quedan los
 *     pósters fijos y no se descarga nada.
 *   · Se pausan fuera de pantalla o con la pestaña oculta, y el visitante
 *     puede pausarlos (requisito de accesibilidad para movimiento automático).
 */

const CLIPS = [
  {
    id: 'gps',
    clase: 'hero-vid__clip--main',
    base: '/video/portada-gps',
    ancho: 848,
    alto: 480,
    etiqueta: 'Plóter GPS',
    descripcion: 'Plóter GPS en operación en el puente de mando, y vista de la flota pesquera en la bahía.',
  },
  {
    id: 'sonar',
    clase: 'hero-vid__clip--side',
    base: '/video/portada-sonar',
    ancho: 408,
    alto: 728,
    etiqueta: 'Sonar',
    descripcion: 'Sonar Furuno en operación a bordo y vista desde el puente.',
  },
];

// AV1 nivel 3.0, perfil Main, 8 bits (verificado con ffprobe).
const TIPO_AV1 = 'video/webm; codecs="av01.0.04M.08"';
const TIPO_H264 = 'video/mp4; codecs="avc1.64001F"';

function videoPermitido() {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false;
  const c = navigator.connection;
  if (c?.saveData) return false;
  if (c && ['slow-2g', '2g'].includes(c.effectiveType)) return false;
  return true;
}

function cuandoCargue(fn) {
  const seguir = () => ('requestIdleCallback' in window
    ? window.requestIdleCallback(fn, { timeout: 1500 })
    : window.setTimeout(fn, 300));
  if (document.readyState === 'complete') seguir();
  else window.addEventListener('load', seguir, { once: true });
}

export default function HeroVideos() {
  const contenedor = useRef(null);
  const videos = useRef([]);
  const [activo, setActivo] = useState(false);     // se permitió y se inició
  const [enPausa, setEnPausa] = useState(false);   // pausa elegida por el visitante
  const pausaManual = useRef(false);
  const visible = useRef(false);

  const reproducir = useCallback(() => {
    if (pausaManual.current || !visible.current || document.hidden) return;
    videos.current.forEach((v) => {
      if (!v) return;
      if (v.preload !== 'auto') { v.preload = 'auto'; v.load(); }
      // Si el navegador bloquea la reproducción (p. ej. modo de bajo consumo
      // en iOS), queda el póster; no es un error.
      v.play().catch(() => {});
    });
  }, []);

  const pausar = useCallback(() => {
    videos.current.forEach((v) => v && !v.paused && v.pause());
  }, []);

  useEffect(() => {
    if (!videoPermitido() || !contenedor.current) return undefined;

    let arrancado = false;
    const io = new IntersectionObserver(([e]) => {
      visible.current = e.isIntersecting;
      if (!e.isIntersecting) { pausar(); return; }
      if (!arrancado) {
        arrancado = true;
        cuandoCargue(() => { setActivo(true); reproducir(); });
      } else {
        reproducir();
      }
    }, { threshold: 0.2 });
    io.observe(contenedor.current);

    const alCambiarPestana = () => (document.hidden ? pausar() : reproducir());
    document.addEventListener('visibilitychange', alCambiarPestana);

    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', alCambiarPestana);
    };
  }, [pausar, reproducir]);

  const alternar = () => {
    pausaManual.current = !pausaManual.current;
    setEnPausa(pausaManual.current);
    if (pausaManual.current) pausar(); else reproducir();
  };

  return (
    <div className="hero-vid" ref={contenedor}>
      {CLIPS.map((c, i) => (
        <figure className={`hero-vid__clip ${c.clase}`} key={c.id}>
          <video
            ref={(el) => { videos.current[i] = el; }}
            width={c.ancho}
            height={c.alto}
            poster={`${c.base}.webp`}
            muted
            loop
            playsInline
            preload="none"
            disablePictureInPicture
            aria-label={c.descripcion}
          >
            <source src={`${c.base}.webm`} type={TIPO_AV1} />
            <source src={`${c.base}.mp4`} type={TIPO_H264} />
          </video>
          <figcaption className="hero-vid__tag">{c.etiqueta}</figcaption>
        </figure>
      ))}

      <div className="hero-vid__note">
        {activo && (
          <button
            type="button"
            className="hero-vid__toggle"
            onClick={alternar}
            aria-pressed={enPausa}
            aria-label={enPausa ? 'Reproducir videos' : 'Pausar videos'}
          >
            {enPausa ? <Play size={15} /> : <Pause size={15} />}
          </button>
        )}
        <span>Equipos en operación a bordo</span>
      </div>
    </div>
  );
}
