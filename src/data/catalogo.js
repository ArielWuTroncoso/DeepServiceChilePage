/**
 * CATÁLOGO.
 *
 * Es la fuente que usan las páginas públicas del catálogo (listado y fichas).
 * La API (`/api/productos`) replica la misma estructura para el panel de
 * administración.
 *
 * Imágenes: viven en `public/productos/<slug>/NN.webp`.
 *   · `imagen`  → la que se muestra en la tarjeta del listado.
 *   · `galeria` → [{ src, alt, ajuste? }] para la ficha. `ajuste: 'cubrir'` se usa
 *     en fotos con fondo propio (pantallas, banners); las fotos recortadas sin
 *     fondo se muestran completas.
 * Productos sin material gráfico siguen con `imagen: null` y la tarjeta dibuja
 * un marco vacío.
 *
 * Las fichas con `completo: true` están verificadas contra la documentación
 * oficial del fabricante (se indica la fuente en cada una). Las marcadas con
 * `completo: false` sólo llevan nombre, categoría y marca.
 */

export const CATEGORIAS = [
  { slug: 'pesca',           nombre: 'Equipos de pesca',     desc: 'Sondas, sonares y transductores para detección bajo el agua.',           icono: 'Fish' },
  { slug: 'navegacion',      nombre: 'Navegación',           desc: 'GPS, plóters, radares, pilotos automáticos y pantallas multifunción.',   icono: 'Compass' },
  { slug: 'comunicaciones',  nombre: 'Comunicaciones',       desc: 'Radios VHF y HF, AIS, satelital e intercomunicadores.',                  icono: 'RadioTower' },
  { slug: 'seguridad',       nombre: 'Seguridad',            desc: 'AIS, radiobalizas, registradores y equipamiento normativo.',             icono: 'LifeBuoy' },
  { slug: 'accesorios',      nombre: 'Accesorios',           desc: 'Transductores, antenas, cables, soportes y repuestos.',                  icono: 'Cable' },
];

/**
 * Marcas representadas.
 *
 * `logo` apunta al logotipo original en `public/marcas/` (PNG recortado, con
 * fondo transparente). `logoRatio` es su proporción ancho/alto: `MarcaSlot` la
 * usa para que todos los logotipos ocupen una superficie visual parecida, sin
 * importar si son cuadrados (ACR) o apaisados (GARMIN). Si una marca no tiene
 * `logo`, la tarjeta compone el nombre tipográficamente.
 */
export const MARCAS = [
  { slug: 'furuno',  nombre: 'FURUNO',  logo: '/marcas/furuno.png', logoRatio: 2.19, destacada: true,
    desc: 'Electrónica marina japonesa: sonares, radares, sondas, GPS y comunicaciones. Es la línea sobre la que trabaja nuestro servicio técnico.' },
  { slug: 'garmin',  nombre: 'GARMIN',  logo: '/marcas/garmin.png', logoRatio: 3.692, destacada: false,
    desc: 'Plóters, sondas y sistemas de navegación con cartografía integrada para embarcaciones menores y de recreo.' },
  { slug: 'icom',    nombre: 'ICOM',    logo: '/marcas/icom.png', logoRatio: 2.117, destacada: false,
    desc: 'Radiocomunicación marina: equipos VHF y HF con llamada selectiva digital (LSD/DSC).' },
  { slug: 'acr',     nombre: 'ACR',     logo: '/marcas/acr.png', logoRatio: 1.0, destacada: false,
    desc: 'Equipamiento de seguridad y localización de emergencia: radiobalizas RLS/EPIRB, PLB y SART.' },
  { slug: 'marport', nombre: 'MARPORT', logo: '/marcas/marport.png', logoRatio: 3.542, destacada: false,
    desc: 'Sensores de monitoreo de captura y control de arte de pesca para flota industrial.' },
];

export const PRODUCTOS = [
  {
    id: 1,
    slug: 'furuno-fcv-800',
    nombre: 'FCV-800',
    marca: 'furuno',
    categoria: 'pesca',
    subcategoria: 'Sonda de pesca',
    destacado: true,
    completo: true,
    resumen: 'Sonda de pesca a color de 8,4" con TruEcho CHIRP™ de 40 a 225 kHz: más detalles y una separación de objetivos sin precedentes.',
    descripcion:
      'Sonda de pesca de la última generación de Furuno. Combina el barrido de banda ancha TruEcho CHIRP™ con frecuencias CW tradicionales y permite conectar dos transductores, de modo que ACCU-FISH™ y la discriminación de fondo trabajen simultáneamente con la imagen CHIRP.',
    // Datos verificados contra el folleto oficial Furuno FCV-600/FCV-800 y furuno.es
    especificaciones: [
      { clave: 'Pantalla',              valor: '8,4" TFT color SVGA 800 × 600' },
      { clave: 'Frecuencias CHIRP',     valor: '40 a 225 kHz' },
      { clave: 'Frecuencias CW',        valor: '50 / 200 kHz' },
      { clave: 'Alcance básico',        valor: '2 a 1.200 m' },
      { clave: 'Potencia de salida',    valor: '600 W / 1 kW' },
      { clave: 'Protección',            valor: 'IP56' },
      { clave: 'Alimentación',          valor: '12 – 24 V CC' },
      { clave: 'Transductores',         valor: 'Capacidad de conectar 2' },
    ],
    destacados: [
      { titulo: 'TruEcho CHIRP™',            desc: 'Banda ancha de 40 a 225 kHz: separación de objetivos sin precedentes.' },
      { titulo: 'ACCU-FISH™',                desc: 'Evalúa el tamaño de cada pez, de 10 a 199 cm, entre 2 y 100 m.' },
      { titulo: 'Discriminación de fondo',   desc: 'Indica si predomina roca, grava, arena o fango.' },
      { titulo: 'RezBoost™',                 desc: 'Imagen hasta 8 veces más nítida con transductores CW convencionales.' },
      { titulo: 'Expansión cromática',       desc: 'Facilita identificar los peces cerca del fondo marino.' },
      { titulo: 'Conectividad inalámbrica',  desc: 'Permite una pantalla secundaria a bordo.' },
    ],
    chips: [
      { valor: '8,4', unidad: '"',    label: 'SVGA 800×600' },
      { valor: '40–225', unidad: 'kHz', label: 'Banda ancha CHIRP' },
      { valor: '2–1.200', unidad: 'm', label: 'Alcance básico' },
      { valor: 'IP56', unidad: '',     label: 'Protección' },
    ],
    imagen: '/productos/furuno-fcv-800/01.webp',
    galeria: [
      { src: '/productos/furuno-fcv-800/01.webp', alt: 'Sonda de pesca Furuno FCV-800, vista en ángulo' },
      { src: '/productos/furuno-fcv-800/02.webp', alt: 'FCV-800, vista frontal' },
    ],
  },
  {
    id: 2, slug: 'furuno-fcv-600', nombre: 'FCV-600', marca: 'furuno', categoria: 'pesca',
    subcategoria: 'Sonda de pesca', destacado: false, completo: false,
    resumen: 'Sonda de pesca a color de 5,7" con TruEcho CHIRP™.',
    descripcion: 'Ficha por completar con la información oficial del fabricante.',
    especificaciones: [], destacados: [], chips: [], imagen: null, galeria: [],
  },
  {
    id: 19,
    slug: 'furuno-ch-500',
    nombre: 'CH-500',
    marca: 'furuno',
    categoria: 'pesca',
    subcategoria: 'Sonar de búsqueda',
    destacado: true,
    completo: true,
    resumen: 'Sonar de búsqueda (searchlight) con pantalla LCD color de 12,1" y frecuencias de 60 a 240 kHz: giro del haz ultrarrápido y ecos de alta resolución.',
    descripcion:
      'Sonar de búsqueda de Furuno con pantalla LCD color de 12,1" XGA. Su motor más rápido y sus seis ángulos de paso seleccionables barren sectores de 24° a 360° en pocos segundos, y los sensores de movimiento integrados —primeros en su clase— estabilizan la imagen cuando la embarcación cabecea y rola, para no perder cardúmenes con mar gruesa.',
    // Datos del folleto oficial Furuno CH-500 (Catálogo CA000002208) y furuno.com
    especificaciones: [
      { clave: 'Pantalla',                  valor: '12,1" LCD color XGA' },
      { clave: 'Frecuencia',                valor: '60 / 88 / 150 / 180 / 240 kHz' },
      { clave: 'Escala horizontal',         valor: '10 a 2.400 m' },
      { clave: 'Resolución de pantalla',    valor: '1024 × 768 (XGA), brillo 0,5 a 950 cd/m²' },
      { clave: 'Escala vertical',           valor: '10 a 600 m (15 escalas)' },
      { clave: 'Potencia de salida',        valor: '0,8 a 1,5 kW según la frecuencia, con función de reducción de potencia' },
      { clave: 'Longitud de pulso',         valor: '0,2 a 20,0 ms, según la escala' },
      { clave: 'TVG',                       valor: 'Nivel 100 dB máx., distancia 1.000 m máx.' },
      { clave: 'Colores de eco',            valor: '32, 16 u 8 colores (seleccionable)' },
      { clave: 'Modos de presentación',     valor: '11 modos: horizontal, horizontal ampliado, vertical, A-scope de círculo completo, ecosonda, historial y sus combinaciones' },
      { clave: 'Barrido horizontal',        valor: 'Sector de 6° a 360°; paso de giro de 6°, 12°, 15°, 18°, 21° o 24°' },
      { clave: 'Inclinación',               valor: '−5° a +90°, en pasos de 1°' },
      { clave: 'Barrido vertical',          valor: 'Sector de 6° a 180°; paso normal 3°, rápido 6°' },
      { clave: 'Ancho de haz (−3 dB, H / V)', valor: '60 kHz 15°/12° · 88 kHz 12°/10° · 150 kHz 7°/7° · 180 kHz 7°/8° · 240 kHz 6°/6°' },
      { clave: 'Estabilización',            valor: 'Sensor de movimiento integrado (de serie)' },
      { clave: 'Unidad de casco',           valor: 'Carrera del transductor 400 mm (CH-504) o 250 mm (CH-505), en versión de 6" u 8"' },
      { clave: 'Subida / bajada',           valor: '30 s con carrera de 400 mm; 20 s con carrera de 250 mm' },
      { clave: 'Velocidad máxima del barco', valor: '20 nudos (15 nudos durante la subida o bajada)' },
      { clave: 'Interfaces',                valor: 'Salida de video HDMI (XGA), 2 puertos NMEA 0183, 1 puerto NMEA 2000, 1 KP externo' },
      { clave: 'Salida de audio',           valor: '2 W (8 Ω), 0,9 a 1,2 kHz (requiere altavoz externo)' },
      { clave: 'Alimentación',              valor: 'Pantalla, control y transceptor: 12–24 V CC (4,7–2,3 A). Unidad de casco: 12/24 V CC (2,2/1,1 A; 7,2/3,6 A al subir)' },
      { clave: 'Protección',                valor: 'Pantalla y control IP55 · Transceptor y unidad de casco IP22' },
      { clave: 'Temperatura de operación',  valor: 'Pantalla, transceptor y control −15 °C a +55 °C · Casco 0 °C a +55 °C · Transductor 0 °C a +35 °C' },
      { clave: 'Equipo estándar',           valor: 'Pantalla MU-121C, unidad de control CH-502, transceptor CH-503 y unidad de casco CH-504 o CH-505' },
      { clave: 'Opcionales',                valor: 'Control remoto CH-256, rectificador RU-1746B-2 (100–230 V CA), altavoz CA-151S-ASSY, tanque de retracción' },
    ],
    destacados: [
      { titulo: 'Giro del haz ultrarrápido',    desc: 'Motor más rápido y 6 ángulos de paso, de 6° a 24°: barre de 24° a 360° en pocos segundos.' },
      { titulo: 'Sensor de movimiento integrado', desc: 'Primero en su clase: compensa cabeceo y balanceo y mantiene estables los ecos con mar gruesa.' },
      { titulo: 'Alta resolución',              desc: 'Procesamiento de señal con interpolación que distingue los cardúmenes incluso cerca del fondo.' },
      { titulo: 'Reducción de reverberación',   desc: 'Separa con claridad los ecos del fondo, por ejemplo un naufragio sobre el lecho marino.' },
      { titulo: 'Control rápido de ganancia',   desc: 'El cambio de ganancia se aplica al instante a todo el círculo, sin esperar la siguiente pasada.' },
      { titulo: 'Detección audible',            desc: 'Un sonido distinto para burbujas, cardúmenes y fondo (requiere altavoz opcional).' },
    ],
    chips: [
      { valor: '12,1', unidad: '"',    label: 'LCD color XGA' },
      { valor: '60–240', unidad: 'kHz', label: '5 frecuencias' },
      { valor: '2.400', unidad: 'm',   label: 'Escala horizontal' },
      { valor: '1,5', unidad: 'kW',    label: 'Potencia máxima' },
    ],
    imagen: '/productos/furuno-ch-500/01.webp',
    galeria: [
      { src: '/productos/furuno-ch-500/01.webp', alt: 'Sonar Furuno CH-500, pantalla y unidad de control' },
      { src: '/productos/furuno-ch-500/02.webp', alt: 'CH-500, vista frontal' },
      { src: '/productos/furuno-ch-500/03.webp', alt: 'Unidades de casco del CH-500 en versión de 6" y 8"', ajuste: 'cubrir' },
      { src: '/productos/furuno-ch-500/04.webp', alt: 'Presentación del CH-500 en pantalla (folleto oficial)', ajuste: 'cubrir' },
    ],
  },
  {
    id: 3,
    slug: 'furuno-csh-5l-mark-2',
    nombre: 'CSH-5L MARK-2',
    marca: 'furuno',
    categoria: 'pesca',
    subcategoria: 'Sonar de círculo completo',
    destacado: true,
    completo: true,
    resumen: 'Sonar color de exploración multihaz en círculo completo: transmite en 360° a la vez y muestra cardúmenes y fondo alrededor del barco sin esperar el giro del haz.',
    descripcion:
      'Sonar de exploración en círculo completo de Furuno, con transmisor de alta potencia para detectar pesca a larga distancia y seguir los cambios del fondo. Presenta los ecos en 16 colores sobre un monitor XGA y, en una escala de 1.000 pies, actualiza los 360° cada 0,54 s, frente a unos 32 s de un sonar PPI convencional. La exploración con inclinación automática y la búsqueda por audio lo hacen especialmente apto para arrastreros pelágicos y cerqueros.',
    // Datos de furuno.com (CSH-5L MARK-2), catálogo oficial CSH-5L MARK-2 y furunousa.com
    especificaciones: [
      { clave: 'Pantalla',                  valor: '15" LCD MU-152HD o monitor XGA' },
      { clave: 'Frecuencia',                valor: '55 o 68 kHz' },
      { clave: 'Escalas',                   valor: '50 a 1.600 m' },
      { clave: 'Resolución de pantalla',    valor: '1024 × 768 (XGA)' },
      { clave: 'Escalas disponibles',       valor: '50, 85, 100, 200, 250, 300, 350, 400, 450, 500, 600, 800, 1.000, 1.200 y 1.600 m' },
      { clave: 'Colores',                   valor: 'Exploración y eco: 16 colores · marcas: 1 color' },
      { clave: 'Modos de operación',        valor: 'Exploración simple; exploración + ecosonda (requiere ecosonda); exploración + búsqueda por audio' },
      { clave: 'Inclinación',               valor: 'Manual de 0° a 55° en pasos de 1°; exploración automática de 4° a 52°' },
      { clave: 'Actualización 360°',        valor: 'Cada 0,54 s en escala de 1.000 pies (≈ 300 m)' },
      { clave: 'Velocidad máxima del barco', valor: '18 nudos (subida o bajada hasta 16 nudos)' },
      { clave: 'Unidad de casco',           valor: 'Carrera de 400 mm (70 kg) o 600 mm (75 kg)' },
      { clave: 'Interfaz',                  valor: 'Entrada y salida NMEA 0183; salida de video RGB analógica' },
      { clave: 'Alimentación',              valor: '115/230 V CA, 50–60 Hz, 0,4 kVA (1 kVA al subir), o 24 V CC con inversor opcional TR-2451' },
      { clave: 'Pesos',                     valor: 'Procesador 3,4 kg · Control 3,5 kg · Transceptor 20 kg' },
      { clave: 'Equipo estándar',           valor: 'Procesador CSH-5210-A, control CSH-5211-A, transceptor CSH-5130-A-5L, preamplificador CSH-5020-A y unidad de casco' },
      { clave: 'Opcionales',                valor: 'Sensor de movimiento MS-100, control remoto CSH-7040, altavoz SEM-21Q, interfaz de ecosonda VI-1100A, inversor TR-2451, tanque de retracción OP10-5' },
    ],
    destacados: [
      { titulo: 'Transmisión en 360°',       desc: 'Detección instantánea de los cardúmenes alrededor del barco, sin zonas ciegas.' },
      { titulo: 'Alta potencia',             desc: 'Transmisor de alta potencia para detectar pesca a larga distancia y seguir los cambios del fondo.' },
      { titulo: 'Inclinación automática',    desc: 'Barre entre 4° y 52° para observar el fondo, la distancia y la demora del blanco.' },
      { titulo: 'Búsqueda por audio',        desc: 'Libera al patrón de vigilar la pantalla de forma continua.' },
      { titulo: '4 teclas programables',     desc: 'F1 a F4 para configurar y operar el equipo con rapidez.' },
      { titulo: 'Configuración de caja negra', desc: 'Funciona con el monitor MU-152HD o con un monitor XGA, ahorrando espacio en el puente.' },
    ],
    chips: [
      { valor: '360', unidad: '°',     label: 'Círculo completo' },
      { valor: '55/68', unidad: 'kHz', label: 'Frecuencia' },
      { valor: '1.600', unidad: 'm',   label: 'Escala máxima' },
      { valor: '0,54', unidad: 's',    label: 'Barrido de 360°' },
    ],
    imagen: '/productos/furuno-csh-5l-mark-2/01.webp',
    galeria: [
      { src: '/productos/furuno-csh-5l-mark-2/01.webp', alt: 'Sonar Furuno CSH-5L MARK-2, monitor y unidad de control' },
    ],
  },
  { id: 4, slug: 'transductor-chirp', nombre: 'Transductor CHIRP', marca: 'furuno', categoria: 'accesorios', subcategoria: 'Transductor', destacado: false, completo: false, resumen: 'Transductor de banda ancha para sondas CHIRP.', descripcion: 'Ficha por completar.', especificaciones: [], destacados: [], chips: [], imagen: null, galeria: [] },
  {
    id: 5,
    slug: 'furuno-model-1815',
    nombre: 'MODEL 1815',
    marca: 'furuno',
    categoria: 'navegacion',
    subcategoria: 'Radar',
    destacado: true,
    completo: true,
    resumen: 'Radar LCD color de 8,4" con antena radomo de 4 kW y hasta 36 MN: ganancia totalmente automática y seguimiento de blancos para embarcaciones de recreo y pesqueros pequeños.',
    descripcion:
      'Radar compacto de Furuno para embarcaciones de recreo y pesqueros pequeños. Sus pulsos estrechos y el doble ancho de banda de FI entregan imágenes detalladas de la costa y de los blancos a corta distancia, incluso con tormenta o niebla. Incorpora Fast Target Tracking™, estela verdadera y vista verdadera, y su pantalla estanca permite instalarlo en puentes volantes expuestos.',
    // Datos del folleto oficial Furuno MODEL1815 (Catálogo CA000001676) y furuno.com
    especificaciones: [
      { clave: 'Pantalla',                  valor: '8,4" LCD color VGA' },
      { clave: 'Potencia de salida',        valor: '4 kW' },
      { clave: 'Escalas',                   valor: '0,0625 a 36 MN' },
      { clave: 'Resolución de pantalla',    valor: '480 × 640 (VGA); área útil 128,2 × 170,9 mm' },
      { clave: 'Antena',                    valor: 'Radomo de 488 mm (19"), 24 rpm' },
      { clave: 'Frecuencia',                valor: '9.410 ± 30 MHz (banda X)' },
      { clave: 'Ancho de haz',              valor: 'Horizontal 5,2°, vertical 25°' },
      { clave: 'Escalas disponibles',       valor: '0,0625 · 0,125 · 0,25 · 0,5 · 0,75 · 1 · 1,5 · 2 · 3 · 4 · 6 · 8 · 12 · 16 · 24 · 36 MN' },
      { clave: 'Distancia mínima',          valor: '25 m (discriminación en distancia: 25 m)' },
      { clave: 'Precisión',                 valor: 'Distancia: 1 % de la escala o 0,01 MN, lo que sea mayor · Demora: ±1°' },
      { clave: 'Modos de presentación',     valor: 'Proa arriba; rumbo arriba, norte arriba y vista verdadera (requieren dato de rumbo); movimiento verdadero (requiere rumbo y posición)' },
      { clave: 'Seguimiento de blancos (TT)', valor: 'Hasta 10 blancos (requiere dato de rumbo)' },
      { clave: 'AIS',                       valor: 'Hasta 100 blancos (requiere rumbo y posición)' },
      { clave: 'Estelas de eco',            valor: 'Verdaderas (requiere rumbo) o relativas; 15 s, 30 s, 1, 3, 6, 15 o 30 min, o continua' },
      { clave: 'Interfaz',                  valor: 'NMEA 0183' },
      { clave: 'Multiestación',             valor: 'Hasta 3 pantallas RDP-157 con una sola antena, mediante hub Ethernet' },
      { clave: 'Alimentación',              valor: '12–24 V CC, 3,2–1,6 A (38 W máx.)' },
      { clave: 'Protección',                valor: 'Pantalla IP56 · Antena IP26' },
      { clave: 'Temperatura de operación',  valor: 'Antena −25 °C a +55 °C · Pantalla −15 °C a +55 °C' },
      { clave: 'Pesos',                     valor: 'Antena 6,5 kg · Pantalla 2,2 kg (con soporte) o 1,6 kg (empotrada)' },
      { clave: 'Equipo estándar',           valor: 'Pantalla RDP-157, antena RSB-127-120, cable de antena de 5, 10, 15, 20 o 30 m y cable de alimentación de 3,3 m' },
      { clave: 'Opcionales',                valor: 'Soporte de antena OP03-209, zumbador externo OP-3-21, convertidor NMEA IF-NMEA2K2, kit de empotrado, hub Ethernet HUB-101' },
    ],
    destacados: [
      { titulo: 'Ganancia totalmente automática', desc: 'Ajusta ganancia, mar y lluvia por sí solo y elimina los ecos innecesarios.' },
      { titulo: 'Fast Target Tracking™',     desc: 'Adquiere y sigue 10 blancos; en segundos muestra su vector de rumbo y velocidad.' },
      { titulo: 'Pantalla AIS',              desc: 'Con un AIS Furuno FA-30 o FA-50, muestra hasta 100 blancos AIS en el radar.' },
      { titulo: 'Estela verdadera',          desc: 'Los blancos en movimiento dejan una estela gradual que muestra su desplazamiento de un vistazo.' },
      { titulo: 'Hasta 3 pantallas',         desc: 'Tres RDP-157 conectadas a una sola antena mediante un hub Ethernet.' },
      { titulo: 'Soporte giratorio',         desc: 'El soporte tipo cardán permite orientar la pantalla para verla con comodidad.' },
    ],
    chips: [
      { valor: '8,4', unidad: '"',   label: 'LCD color VGA' },
      { valor: '4', unidad: 'kW',    label: 'Radomo de 19"' },
      { valor: '36', unidad: 'MN',   label: 'Escala máxima' },
      { valor: '10', unidad: '',     label: 'Blancos TT' },
    ],
    imagen: '/productos/furuno-model-1815/01.webp',
    galeria: [
      { src: '/productos/furuno-model-1815/01.webp', alt: 'Radar Furuno MODEL 1815, vista frontal' },
      { src: '/productos/furuno-model-1815/02.webp', alt: 'MODEL 1815, vista en ángulo con soporte' },
      { src: '/productos/furuno-model-1815/03.webp', alt: 'Pantalla del MODEL 1815 con seguimiento de blancos (folleto oficial)', ajuste: 'cubrir' },
      { src: '/productos/furuno-model-1815/04.webp', alt: 'Soporte giratorio de la pantalla' },
    ],
  },
  { id: 6, slug: 'gps-plotter', nombre: 'GPS / Plóter', marca: 'furuno', categoria: 'navegacion', subcategoria: 'GPS / Plóter', destacado: false, completo: false, resumen: 'Posicionamiento y cartografía electrónica.', descripcion: 'Ficha por completar.', especificaciones: [], destacados: [], chips: [], imagen: null, galeria: [] },
  { id: 7, slug: 'piloto-automatico', nombre: 'Piloto automático', marca: 'furuno', categoria: 'navegacion', subcategoria: 'Piloto automático', destacado: false, completo: false, resumen: 'Gobierno automático de rumbo.', descripcion: 'Ficha por completar.', especificaciones: [], destacados: [], chips: [], imagen: null, galeria: [] },
  { id: 8, slug: 'pantalla-multifuncion', nombre: 'Pantalla multifunción', marca: 'furuno', categoria: 'navegacion', subcategoria: 'Pantalla multifunción', destacado: false, completo: false, resumen: 'Integra sonda, radar y cartografía en una sola pantalla.', descripcion: 'Ficha por completar.', especificaciones: [], destacados: [], chips: [], imagen: null, galeria: [] },
  { id: 9, slug: 'radio-vhf', nombre: 'Radio VHF', marca: 'icom', categoria: 'comunicaciones', subcategoria: 'Radioteléfono', destacado: false, completo: false, resumen: 'Comunicación en banda marina VHF con LSD.', descripcion: 'Ficha por completar.', especificaciones: [], destacados: [], chips: [], imagen: null, galeria: [] },
  { id: 10, slug: 'transponder-ais', nombre: 'Transpondedor AIS', marca: 'furuno', categoria: 'comunicaciones', subcategoria: 'AIS', destacado: false, completo: false, resumen: 'Identificación automática de embarcaciones.', descripcion: 'Ficha por completar.', especificaciones: [], destacados: [], chips: [], imagen: null, galeria: [] },
  { id: 11, slug: 'comunicacion-satelital', nombre: 'Comunicación satelital', marca: 'furuno', categoria: 'comunicaciones', subcategoria: 'Satelital', destacado: false, completo: false, resumen: 'Voz y datos fuera de cobertura costera.', descripcion: 'Ficha por completar.', especificaciones: [], destacados: [], chips: [], imagen: null, galeria: [] },
  { id: 12, slug: 'radiobaliza-epirb', nombre: 'Radiobaliza RLS / EPIRB', marca: 'acr', categoria: 'seguridad', subcategoria: 'Emergencia', destacado: false, completo: false, resumen: 'Baliza de emergencia con posicionamiento satelital.', descripcion: 'Ficha por completar.', especificaciones: [], destacados: [], chips: [], imagen: null, galeria: [] },
  { id: 13, slug: 'registrador-vdr', nombre: 'Registrador VDR', marca: 'furuno', categoria: 'seguridad', subcategoria: 'VDR', destacado: false, completo: false, resumen: 'Registro de datos de travesía según normativa.', descripcion: 'Ficha por completar.', especificaciones: [], destacados: [], chips: [], imagen: null, galeria: [] },
  { id: 14, slug: 'antena-gps', nombre: 'Antena GPS', marca: 'furuno', categoria: 'accesorios', subcategoria: 'Antena', destacado: false, completo: false, resumen: 'Antena receptora para sistemas de posicionamiento.', descripcion: 'Ficha por completar.', especificaciones: [], destacados: [], chips: [], imagen: null, galeria: [] },
  { id: 15, slug: 'cableado-conectores', nombre: 'Cableado y conectores', marca: 'furuno', categoria: 'accesorios', subcategoria: 'Instalación', destacado: false, completo: false, resumen: 'Insumos de instalación para electrónica marina.', descripcion: 'Ficha por completar.', especificaciones: [], destacados: [], chips: [], imagen: null, galeria: [] },
  { id: 16, slug: 'sensores-captura', nombre: 'Sensores de captura', marca: 'marport', categoria: 'pesca', subcategoria: 'Monitoreo de arte', destacado: false, completo: false, resumen: 'Monitoreo en tiempo real del arte de pesca y del volumen capturado.', descripcion: 'Ficha por completar.', especificaciones: [], destacados: [], chips: [], imagen: null, galeria: [] },
  { id: 17, slug: 'ploter-cartografico', nombre: 'Plóter cartográfico', marca: 'garmin', categoria: 'navegacion', subcategoria: 'GPS / Plóter', destacado: false, completo: false, resumen: 'Navegación con cartografía integrada para embarcaciones menores.', descripcion: 'Ficha por completar.', especificaciones: [], destacados: [], chips: [], imagen: null, galeria: [] },
  { id: 18, slug: 'radio-hf', nombre: 'Radio HF / SSB', marca: 'icom', categoria: 'comunicaciones', subcategoria: 'Radioteléfono', destacado: false, completo: false, resumen: 'Comunicación de largo alcance en banda marina HF.', descripcion: 'Ficha por completar.', especificaciones: [], destacados: [], chips: [], imagen: null, galeria: [] },
];

export const nombreCategoria = (slug) => CATEGORIAS.find((c) => c.slug === slug)?.nombre ?? slug;
export const nombreMarca = (slug) => MARCAS.find((m) => m.slug === slug)?.nombre ?? slug;
