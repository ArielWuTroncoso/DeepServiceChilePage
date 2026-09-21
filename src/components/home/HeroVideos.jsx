import { useCallback, useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { useIdioma } from '../../i18n/IdiomaContext';

/**
 * Carrusel de videos de portada: se ve un video; al terminar, el marco se
 * desliza al siguiente; al terminar el último, vuelve al primero.
 *
 * Los dos archivos comparten la proporción horizontal del marco. El sonar se
 * grabó en vertical, así que viene montado sobre una copia difuminada de sí
 * mismo (sin recortar el video original).
 *
 * Ancho de banda (plan Hobby de Render: 5 GB/mes):
 *   · Al cargar la página sólo bajan los pósters (~20–26 KB c/u).
 *   · El primer video empieza cuando el marco está en pantalla y la página
 *     terminó de cargar. El SEGUNDO sólo se descarga cuando al primero le
 *     quedan ~5 s: quien se va antes no lo descarga.
 *   · Con "ahorro de datos" o conexión 2G se quedan los pósters fijos.
 *   · Los dos <video> quedan montados, así las vueltas siguientes usan lo que
 *     ya está en memoria y no vuelven a descargar.
 */

const CLIPS = [
  {
    id: 'sonar',
    base: '/video/portada-sonar',
    etiqueta: { es: 'Sonar', en: 'Sonar' },
    descripcion: {
      es: 'Sonar Furuno en operación a bordo y vista desde el puente de mando.',
      en: 'Furuno sonar operating on board, and the view from the bridge.',
    },
  },
  {
    id: 'gps',
    base: '/video/portada-gps',
    etiqueta: { es: 'Plóter GPS', en: 'GPS plotter' },
    descripcion: {
      es: 'Plóter GPS Garmin en operación y vista de la flota pesquera en la bahía.',
      en: 'Garmin GPS plotter in operation, and the fishing fleet in the bay.',
    },
  },
];

// Códecs exactos (verificados con ffprobe) para que cada navegador elija bien.
const TIPO_AV1 = 'video/webm; codecs="av01.0.04M.08"';
const TIPO_H264 = 'video/mp4; codecs="avc1.64001F"';

const DESLIZ_MS = 900;        // duración del deslizamiento (igual que en CSS)
const ADELANTO_S = 0.85;      // se empieza a deslizar poco antes del final
const PRECARGA_S = 5;         // se pide el siguiente video cuando faltan 5 s

/** Sólo razones de ANCHO DE BANDA impiden el video. "Reducir movimiento" no:
 *  el visitante tiene el botón de pausa. */
function videoPermitido() {
  const c = typeof navigator !== 'undefined' ? navigator.connection : undefined;
  if (c?.saveData) return false;
  if (c && ['slow-2g', '2g'].includes(c.effectiveType)) return false;
  return true;
}

function cuandoCargue(fn) {
  const seguir = () => ('requestIdleCallback' in window
    ? window.requestIdleCallback(fn, { timeout: 1200 })
    : window.setTimeout(fn, 250));
  if (document.readyState === 'complete') seguir();
  else window.addEventListener('load', seguir, { once: true });
}

function cargar(v) {
  if (v && v.preload !== 'auto') { v.preload = 'auto'; v.load(); }
}

export default function HeroVideos() {
  const { idioma, t } = useIdioma();
  const marco = useRef(null);
  const videos = useRef([]);
  const [actual, setActual] = useState(0);
  const [saliente, setSaliente] = useState(null);
  const [activo, setActivo] = useState(false);
  const [enPausa, setEnPausa] = useState(false);
  const [progreso, setProgreso] = useState(0);

  // Refs espejo del estado, para usarlos dentro de los manejadores de eventos.
  const st = useRef({ actual: 0, activo: false, pausa: false, visible: false, avanzando: false });

  const reproducirActual = useCallback(() => {
    const s = st.current;
    if (!s.activo || s.pausa || !s.visible || document.hidden) return;
    const v = videos.current[s.actual];
    if (!v) return;
    cargar(v);
    v.play().catch(() => {});
  }, []);

  const pausarTodo = useCallback(() => {
    videos.current.forEach((v) => v && !v.paused && v.pause());
  }, []);

  const irA = useCallback((destino) => {
    const s = st.current;
    if (destino === s.actual || s.avanzando) return;
    s.avanzando = true;
    const origen = s.actual;
    const vNuevo = videos.current[destino];
    cargar(vNuevo);
    try { vNuevo.currentTime = 0; } catch { /* aún sin metadatos */ }

    s.actual = destino;
    setSaliente(origen);
    setActual(destino);
    setProgreso(0);
    reproducirActual();

    window.setTimeout(() => {
      const vViejo = videos.current[origen];
      if (vViejo) { vViejo.pause(); try { vViejo.currentTime = 0; } catch { /* nada */ } }
      setSaliente(null);         // el que salió vuelve, oculto, a la derecha
      s.avanzando = false;
    }, DESLIZ_MS + 30);
  }, [reproducirActual]);

  const siguiente = useCallback(() => {
    irA((st.current.actual + 1) % CLIPS.length);
  }, [irA]);

  // Inicio: cuando el marco entra en pantalla y la página ya cargó.
  useEffect(() => {
    // React no escribe el atributo `muted` en el HTML; Safari/iOS lo exige
    // para reproducir sin interacción. Se fija a mano.
    videos.current.forEach((v) => {
      if (!v) return;
      v.muted = true; v.defaultMuted = true; v.setAttribute('muted', '');
      v.setAttribute('playsinline', ''); v.setAttribute('webkit-playsinline', '');
    });

    if (!videoPermitido() || !marco.current) return undefined;
    let arrancado = false;
    const io = new IntersectionObserver(([e]) => {
      st.current.visible = e.isIntersecting;
      if (!e.isIntersecting) { pausarTodo(); return; }
      if (!arrancado) {
        arrancado = true;
        cuandoCargue(() => {
          st.current.activo = true;
          setActivo(true);
          reproducirActual();
        });
      } else {
        reproducirActual();
      }
    }, { threshold: 0.25 });
    io.observe(marco.current);

    const alCambiarPestana = () => (document.hidden ? pausarTodo() : reproducirActual());
    document.addEventListener('visibilitychange', alCambiarPestana);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', alCambiarPestana);
    };
  }, [pausarTodo, reproducirActual]);

  // Progreso, precarga del siguiente y avance automático.
  const alAvanzarTiempo = (i) => (e) => {
    const s = st.current;
    if (i !== s.actual) return;
    const v = e.currentTarget;
    if (!v.duration || Number.isNaN(v.duration)) return;
    const resta = v.duration - v.currentTime;
    setProgreso(Math.min(1, v.currentTime / v.duration));
    if (resta < PRECARGA_S) cargar(videos.current[(i + 1) % CLIPS.length]);
    if (resta < ADELANTO_S && !s.pausa) siguiente();
  };

  const alTerminar = (i) => () => {
    if (i === st.current.actual && !st.current.pausa) siguiente();
  };

  const alternarPausa = () => {
    const s = st.current;
    s.pausa = !s.pausa;
    setEnPausa(s.pausa);
    if (s.pausa) pausarTodo(); else reproducirActual();
  };

  const estadoSlide = (i) => {
    if (i === actual) return 'is-actual';
    if (i === saliente) return 'is-saliendo';
    return '';
  };

  return (
    <div className="hero-car">
      <div className="hero-car__frame" ref={marco} aria-roledescription={t('carrusel', 'carousel')} aria-label={t('Videos a bordo', 'On-board videos')}>
        {CLIPS.map((c, i) => (
          <figure
            className={`hero-car__slide ${estadoSlide(i)}`}
            key={c.id}
            aria-hidden={i !== actual}
          >
            <video
              ref={(el) => { videos.current[i] = el; }}
              poster={`${c.base}.webp`}
              muted
              playsInline
              preload="none"
              disablePictureInPicture
              aria-label={c.descripcion[idioma]}
              onTimeUpdate={alAvanzarTiempo(i)}
              onEnded={alTerminar(i)}
            >
              <source src={`${c.base}.webm`} type={TIPO_AV1} />
              <source src={`${c.base}.mp4`} type={TIPO_H264} />
            </video>
            <figcaption className="hero-car__tag">{c.etiqueta[idioma]}</figcaption>
          </figure>
        ))}
      </div>

      <div className="hero-car__bar">
        <button
          type="button"
          className="hero-car__toggle"
          onClick={alternarPausa}
          disabled={!activo}
          aria-pressed={enPausa}
          aria-label={enPausa ? t('Reproducir videos', 'Play videos') : t('Pausar videos', 'Pause videos')}
        >
          {enPausa || !activo ? <Play size={15} /> : <Pause size={15} />}
        </button>
        <div className="hero-car__dots" role="tablist" aria-label={t('Elegir video', 'Choose video')}>
          {CLIPS.map((c, i) => (
            <button
              type="button"
              role="tab"
              key={c.id}
              className={`hero-car__dot${i === actual ? ' is-on' : ''}`}
              aria-selected={i === actual}
              onClick={() => { if (!activo) return; irA(i); }}
            >
              <span>{c.etiqueta[idioma]}</span>
              <i aria-hidden="true">
                <b style={{ transform: `scaleX(${i === actual ? progreso : 0})` }} />
              </i>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
