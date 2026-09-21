/**
 * ESTRUCTURA DEL CATÁLOGO.
 *
 * Sirve como respaldo del frontend cuando el backend todavía no responde y como
 * referencia del formato que devuelve la API (`/api/productos`).
 *
 * IMPORTANTE: a propósito NO hay imágenes. Cada tarjeta y cada ficha muestran un
 * marco vacío. Cuando tengas el material, basta con añadir `imagen` (ruta o URL)
 * y `galeria: []` a cada producto; los componentes ya contemplan ambos campos.
 *
 * Las fichas marcadas con `completo: false` sólo llevan nombre, categoría y marca:
 * las especificaciones quedan pendientes de confirmar contra el fabricante.
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
 * `logo` apunta a un archivo dentro de `public/marcas/`. Mientras sea `null`,
 * la tarjeta muestra el nombre compuesto tipográficamente, que es una solución
 * válida en sí misma. Para usar el logotipo oficial basta con dejar el archivo
 * en esa carpeta (preferentemente SVG o PNG con fondo transparente) y escribir
 * aquí su ruta, p. ej. `logo: '/marcas/furuno.svg'`.
 */
export const MARCAS = [
  { slug: 'furuno',  nombre: 'FURUNO',  logo: null, destacada: true,
    desc: 'Electrónica marina japonesa: sonares, radares, sondas, GPS y comunicaciones. Es la línea sobre la que trabaja nuestro servicio técnico.' },
  { slug: 'garmin',  nombre: 'GARMIN',  logo: null, destacada: false,
    desc: 'Plóters, sondas y sistemas de navegación con cartografía integrada para embarcaciones menores y de recreo.' },
  { slug: 'icom',    nombre: 'ICOM',    logo: null, destacada: false,
    desc: 'Radiocomunicación marina: equipos VHF y HF con llamada selectiva digital (LSD/DSC).' },
  { slug: 'acr',     nombre: 'ACR',     logo: null, destacada: false,
    desc: 'Equipamiento de seguridad y localización de emergencia: radiobalizas RLS/EPIRB, PLB y SART.' },
  { slug: 'marport', nombre: 'MARPORT', logo: null, destacada: false,
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
    imagen: null,
    galeria: [],
  },
  {
    id: 2, slug: 'furuno-fcv-600', nombre: 'FCV-600', marca: 'furuno', categoria: 'pesca',
    subcategoria: 'Sonda de pesca', destacado: false, completo: false,
    resumen: 'Sonda de pesca a color de 5,7" con TruEcho CHIRP™.',
    descripcion: 'Ficha por completar con la información oficial del fabricante.',
    especificaciones: [], destacados: [], chips: [], imagen: null, galeria: [],
  },
  { id: 3, slug: 'sonar-omnidireccional', nombre: 'Sonar omnidireccional', marca: 'furuno', categoria: 'pesca', subcategoria: 'Sonar', destacado: false, completo: false, resumen: 'Detección de cardúmenes en 360°.', descripcion: 'Ficha por completar.', especificaciones: [], destacados: [], chips: [], imagen: null, galeria: [] },
  { id: 4, slug: 'transductor-chirp', nombre: 'Transductor CHIRP', marca: 'furuno', categoria: 'accesorios', subcategoria: 'Transductor', destacado: false, completo: false, resumen: 'Transductor de banda ancha para sondas CHIRP.', descripcion: 'Ficha por completar.', especificaciones: [], destacados: [], chips: [], imagen: null, galeria: [] },
  { id: 5, slug: 'radar-banda-x', nombre: 'Radar banda X', marca: 'furuno', categoria: 'navegacion', subcategoria: 'Radar', destacado: true, completo: false, resumen: 'Radar de navegación para embarcaciones menores y mayores.', descripcion: 'Ficha por completar.', especificaciones: [], destacados: [], chips: [], imagen: null, galeria: [] },
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
