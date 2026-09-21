/**
 * Catalog — ENGLISH overrides.
 *
 * Only the text changes; slugs, brands, images and flags come from `catalogo.js`.
 * Spec sheets marked `completo: true` are taken from Furuno's original English
 * documentation (the same sources cited in `catalogo.js`), using English number
 * formatting (1,200 m · 0.54 s · 12.1").
 */

export const CATEGORIAS_EN = {
  pesca:          { nombre: 'Fishing equipment', desc: 'Echo sounders, sonars and transducers for underwater detection.' },
  navegacion:     { nombre: 'Navigation',        desc: 'GPS, chart plotters, radars, autopilots and multifunction displays.' },
  comunicaciones: { nombre: 'Communications',    desc: 'VHF and HF radios, AIS, satellite and intercoms.' },
  seguridad:      { nombre: 'Safety',            desc: 'AIS, emergency beacons, recorders and regulatory equipment.' },
  accesorios:     { nombre: 'Accessories',       desc: 'Transducers, antennas, cables, brackets and spare parts.' },
};

export const MARCAS_EN = {
  furuno:  { desc: 'Japanese marine electronics: sonars, radars, echo sounders, GPS and communications. It is the line our technical service specializes in.' },
  garmin:  { desc: 'Chart plotters, echo sounders and navigation systems with built-in charts for small craft and pleasure boats.' },
  icom:    { desc: 'Marine radio communications: VHF and HF equipment with digital selective calling (DSC).' },
  acr:     { desc: 'Safety and emergency location equipment: EPIRBs, PLBs and SARTs.' },
  marport: { desc: 'Catch monitoring and fishing gear control sensors for industrial fleets.' },
};

/** Description used for sheets that are still in preparation. */
export const DESCRIPCION_PENDIENTE_EN = 'Spec sheet in preparation with the manufacturer’s official information.';

export const PRODUCTOS_EN = {
  'furuno-fcv-800': {
    subcategoria: 'Fish finder',
    resumen: '8.4" color fish finder with TruEcho CHIRP™ from 40 to 225 kHz: more detail and unparalleled target separation.',
    descripcion:
      'The latest-generation fish finder from Furuno. It combines TruEcho CHIRP™ wideband sweep with traditional CW frequencies and supports two transducers, so ACCU-FISH™ and Bottom Discrimination can run at the same time as the CHIRP picture.',
    especificaciones: [
      { clave: 'Display',          valor: '8.4" color TFT, SVGA 800 × 600' },
      { clave: 'CHIRP frequencies', valor: '40 to 225 kHz' },
      { clave: 'CW frequencies',   valor: '50 / 200 kHz' },
      { clave: 'Basic range',      valor: '2 to 1,200 m' },
      { clave: 'Output power',     valor: '600 W / 1 kW' },
      { clave: 'Waterproofing',    valor: 'IP56' },
      { clave: 'Power supply',     valor: '12–24 VDC' },
      { clave: 'Transducers',      valor: 'Up to 2 can be connected' },
    ],
    destacados: [
      { titulo: 'TruEcho CHIRP™',        desc: 'Wideband from 40 to 225 kHz: unparalleled target separation.' },
      { titulo: 'ACCU-FISH™',            desc: 'Estimates the size of individual fish from 10 to 199 cm, at depths of 2 to 100 m.' },
      { titulo: 'Bottom Discrimination', desc: 'Shows whether the bottom is mainly rock, gravel, sand or mud.' },
      { titulo: 'RezBoost™',             desc: 'Up to 8 times sharper picture with conventional CW transducers.' },
      { titulo: 'Color expansion',       desc: 'Makes it easier to identify fish close to the seabed.' },
      { titulo: 'Wireless connectivity', desc: 'Allows a second display on board.' },
    ],
    chips: [
      { valor: '8.4', unidad: '"',      label: 'SVGA 800×600' },
      { valor: '40–225', unidad: 'kHz', label: 'CHIRP wideband' },
      { valor: '2–1,200', unidad: 'm',  label: 'Basic range' },
      { valor: 'IP56', unidad: '',      label: 'Waterproofing' },
    ],
    galeriaAlt: ['Furuno FCV-800 fish finder, angled view', 'FCV-800, front view'],
  },

  'furuno-fcv-600': {
    subcategoria: 'Fish finder',
    resumen: '5.7" color fish finder with TruEcho CHIRP™.',
  },

  'furuno-ch-500': {
    subcategoria: 'Searchlight sonar',
    resumen: 'Searchlight sonar with a 12.1" color LCD and frequencies from 60 to 240 kHz: unmatched training speed and high-resolution echoes.',
    descripcion:
      'Furuno searchlight sonar with a 12.1" XGA color LCD. A faster motor and six selectable step angles scan sectors from 24° to 360° in a couple of seconds, and its integrated motion sensors —the first in its class— stabilize the picture when the vessel pitches and rolls, so fish schools are not lost in rough seas.',
    especificaciones: [
      { clave: 'Display',                   valor: '12.1" color LCD, XGA' },
      { clave: 'Frequency',                 valor: '60 / 88 / 150 / 180 / 240 kHz' },
      { clave: 'Horizontal range',          valor: '10 to 2,400 m' },
      { clave: 'Screen resolution',         valor: '1024 × 768 (XGA), brilliance 0.5 to 950 cd/m²' },
      { clave: 'Vertical range',            valor: '10 to 600 m (15 steps)' },
      { clave: 'Output power',              valor: '0.8 to 1.5 kW depending on frequency, with power reduction function' },
      { clave: 'Pulse length',              valor: '0.2 to 20.0 ms, according to range' },
      { clave: 'TVG',                       valor: 'Level 100 dB max., distance 1,000 m max.' },
      { clave: 'Echo colors',               valor: '32, 16 or 8 colors (selectable)' },
      { clave: 'Display modes',             valor: '11 modes: horizontal, horizontal (zoomed), vertical, full-circle A-scope, echo sounder, history and their combinations' },
      { clave: 'Horizontal scan',           valor: 'Sector 6° to 360°; step angle 6°, 12°, 15°, 18°, 21° or 24°' },
      { clave: 'Tilt',                      valor: '−5° to +90°, in 1° steps' },
      { clave: 'Vertical scan',             valor: 'Sector 6° to 180°; step angle normal 3°, high-speed 6°' },
      { clave: 'Beamwidth (−3 dB, H / V)',  valor: '60 kHz 15°/12° · 88 kHz 12°/10° · 150 kHz 7°/7° · 180 kHz 7°/8° · 240 kHz 6°/6°' },
      { clave: 'Stabilization',             valor: 'Built-in motion sensor (standard supply)' },
      { clave: 'Hull unit',                 valor: 'Transducer travel 400 mm (CH-504) or 250 mm (CH-505), 6" or 8" type' },
      { clave: 'Raise / lower',             valor: '30 s at 400 mm travel; 20 s at 250 mm travel' },
      { clave: 'Allowable ship’s speed',    valor: '20 kn (15 kn during raise/lower operation)' },
      { clave: 'Interfaces',                valor: 'HDMI video output (XGA), 2 NMEA 0183 ports, 1 NMEA 2000 port, 1 external KP' },
      { clave: 'Audio output',              valor: '2 W (8 Ω), 0.9 to 1.2 kHz (external speaker required)' },
      { clave: 'Power supply',              valor: 'Display, control and transceiver: 12–24 VDC (4.7–2.3 A). Hull unit: 12/24 VDC (2.2/1.1 A; 7.2/3.6 A while raising)' },
      { clave: 'Degree of protection',      valor: 'Display and control unit IP55 · Transceiver and hull unit IP22' },
      { clave: 'Operating temperature',     valor: 'Display, transceiver and control −15 °C to +55 °C · Hull unit 0 °C to +55 °C · Transducer 0 °C to +35 °C' },
      { clave: 'Standard supply',           valor: 'Display MU-121C, control unit CH-502, transceiver CH-503 and hull unit CH-504 or CH-505' },
      { clave: 'Options',                   valor: 'Remote controller CH-256, rectifier RU-1746B-2 (100–230 VAC), loudspeaker CA-151S-ASSY, retraction tank' },
    ],
    destacados: [
      { titulo: 'Unmatched training speed',   desc: 'Faster motor and 6 step angles, from 6° to 24°: scans 24° to 360° in a couple of seconds.' },
      { titulo: 'Built-in motion sensor',     desc: 'First in its class: compensates for pitch and roll and keeps echoes stable in rough seas.' },
      { titulo: 'High resolution',            desc: 'Interpolation-based signal processing that separates fish schools even close to the seabed.' },
      { titulo: 'Reverberation reduction',    desc: 'Clearly separates echoes from the bottom, such as a wreck on the seabed.' },
      { titulo: 'Quick Gain Control',         desc: 'Gain changes apply instantly to the whole circle, with no wait for the next pass.' },
      { titulo: 'Audible target detection',   desc: 'A distinct sound for bubbles, fish schools and seabed (optional loudspeaker required).' },
    ],
    chips: [
      { valor: '12.1', unidad: '"',     label: 'Color XGA LCD' },
      { valor: '60–240', unidad: 'kHz', label: '5 frequencies' },
      { valor: '2,400', unidad: 'm',    label: 'Horizontal range' },
      { valor: '1.5', unidad: 'kW',     label: 'Max. output' },
    ],
    galeriaAlt: [
      'Furuno CH-500 sonar, display and control unit',
      'CH-500, front view',
      'CH-500 hull units, 6" and 8" types',
      'CH-500 on-screen presentation (official brochure)',
    ],
  },

  'furuno-csh-5l-mark-2': {
    subcategoria: 'Full-circle scanning sonar',
    resumen: 'Full-circle multi-beam color scanning sonar: transmits 360° at once and shows fish schools and seabed all around the vessel, with no wait for the beam to train.',
    descripcion:
      'Furuno full-circle scanning sonar with a high-power transmitter for long-range fish detection and for following changing seabed conditions. Echoes are shown in 16 colors on an XGA monitor and, on a 1,000 ft range, the 360° picture is refreshed every 0.54 s, compared with about 32 s for a conventional PPI sonar. Automatic tilt scan and audio search make it especially suited to pelagic trawlers and purse seiners.',
    especificaciones: [
      { clave: 'Display',                valor: '15" LCD MU-152HD or XGA monitor' },
      { clave: 'Frequency',              valor: '55 or 68 kHz' },
      { clave: 'Ranges',                 valor: '50 to 1,600 m' },
      { clave: 'Screen resolution',      valor: '1024 × 768 (XGA)' },
      { clave: 'Available ranges',       valor: '50, 85, 100, 200, 250, 300, 350, 400, 450, 500, 600, 800, 1,000, 1,200 and 1,600 m' },
      { clave: 'Colors',                 valor: 'Scan/echo: 16 colors · marks: 1 color' },
      { clave: 'Operating modes',        valor: 'Single scan; scan + echo sounder (echo sounder required); scan + audio search' },
      { clave: 'Tilt',                   valor: 'Manual 0° to 55° in 1° steps; automatic tilt scan 4° to 52°' },
      { clave: '360° refresh',           valor: 'Every 0.54 s on a 1,000 ft range (≈ 300 m)' },
      { clave: 'Allowable ship’s speed', valor: '18 kn (raise/lower operation up to 16 kn)' },
      { clave: 'Hull unit',              valor: '400 mm (70 kg) or 600 mm (75 kg) travel' },
      { clave: 'Interface',              valor: 'NMEA 0183 input/output; RGB analog video output' },
      { clave: 'Power supply',           valor: '115/230 VAC, 50–60 Hz, 0.4 kVA (1 kVA while raising), or 24 VDC with optional DC-AC inverter TR-2451' },
      { clave: 'Weights',                valor: 'Processor 3.4 kg · Control unit 3.5 kg · Transceiver 20 kg' },
      { clave: 'Standard supply',        valor: 'Processor CSH-5210-A, control unit CSH-5211-A, transceiver CSH-5130-A-5L, pre-amplifier CSH-5020-A and hull unit' },
      { clave: 'Options',                valor: 'Motion sensor MS-100, remote controller CSH-7040, speaker SEM-21Q, E/S interface VI-1100A, DC-AC inverter TR-2451, retraction tank OP10-5' },
    ],
    destacados: [
      { titulo: '360° transmission',       desc: 'Instant detection of fish schools all around the vessel, with no blind areas.' },
      { titulo: 'High power',              desc: 'High-power transmitter for long-range fish detection and for following seabed changes.' },
      { titulo: 'Automatic tilt scan',     desc: 'Scans between 4° and 52° to observe the seabed, target range and bearing.' },
      { titulo: 'Audio search',            desc: 'Frees the skipper from constantly watching the screen.' },
      { titulo: '4 programmable keys',     desc: 'F1 to F4 for quick setup and operation.' },
      { titulo: 'Black-box configuration', desc: 'Works with the MU-152HD monitor or any XGA monitor, saving space on the bridge.' },
    ],
    chips: [
      { valor: '360', unidad: '°',     label: 'Full circle' },
      { valor: '55/68', unidad: 'kHz', label: 'Frequency' },
      { valor: '1,600', unidad: 'm',   label: 'Max. range' },
      { valor: '0.54', unidad: 's',    label: '360° scan' },
    ],
    galeriaAlt: ['Furuno CSH-5L MARK-2 sonar, monitor and control unit'],
  },

  'transductor-chirp':      { nombre: 'CHIRP transducer',        subcategoria: 'Transducer',          resumen: 'Wideband transducer for CHIRP fish finders.' },

  'furuno-model-1815': {
    subcategoria: 'Radar',
    resumen: '8.4" color LCD radar with a 4 kW radome antenna and up to 36 NM: fully automatic gain and target tracking for pleasure craft and small fishing boats.',
    descripcion:
      'Compact Furuno radar designed for pleasure craft and small fishing boats. Narrow pulses and dual IF bandwidths produce detailed pictures of coastlines and targets at short range, even in storms or fog. It features Fast Target Tracking™, True Trail and True View modes, and its waterproof display is ideal for exposed installations such as fly bridges.',
    especificaciones: [
      { clave: 'Display',                  valor: '8.4" color LCD, VGA' },
      { clave: 'Peak output power',        valor: '4 kW' },
      { clave: 'Ranges',                   valor: '0.0625 to 36 NM' },
      { clave: 'Screen resolution',        valor: '480 × 640 (VGA); effective area 128.2 × 170.9 mm' },
      { clave: 'Antenna',                  valor: '488 mm (19") radome, 24 rpm' },
      { clave: 'Frequency',                valor: '9410 ± 30 MHz (X-band)' },
      { clave: 'Beamwidth',                valor: 'Horizontal 5.2°, vertical 25°' },
      { clave: 'Available ranges',         valor: '0.0625 · 0.125 · 0.25 · 0.5 · 0.75 · 1 · 1.5 · 2 · 3 · 4 · 6 · 8 · 12 · 16 · 24 · 36 NM' },
      { clave: 'Minimum range',            valor: '25 m (range discrimination: 25 m)' },
      { clave: 'Accuracy',                 valor: 'Range: 1% of range in use or 0.01 NM, whichever is greater · Bearing: ±1°' },
      { clave: 'Presentation modes',       valor: 'Head-up; course-up, north-up and true view (heading data required); true motion (heading and position data required)' },
      { clave: 'Target tracking (TT)',     valor: 'Up to 10 targets (heading data required)' },
      { clave: 'AIS',                      valor: 'Up to 100 targets (heading and position data required)' },
      { clave: 'Echo trails',              valor: 'True (heading data required) or relative; 15 s, 30 s, 1, 3, 6, 15 or 30 min, or continuous' },
      { clave: 'Interface',                valor: 'NMEA 0183' },
      { clave: 'Multi-station',            valor: 'Up to 3 RDP-157 displays on a single antenna, via Ethernet hub' },
      { clave: 'Power supply',             valor: '12–24 VDC, 3.2–1.6 A (38 W max.)' },
      { clave: 'Waterproofing',            valor: 'Display IP56 · Antenna IP26' },
      { clave: 'Operating temperature',    valor: 'Antenna −25 °C to +55 °C · Display −15 °C to +55 °C' },
      { clave: 'Weights',                  valor: 'Antenna 6.5 kg · Display 2.2 kg (bracket mount) or 1.6 kg (flush mount)' },
      { clave: 'Standard supply',          valor: 'Display RDP-157, antenna RSB-127-120, 5, 10, 15, 20 or 30 m antenna cable and 3.3 m power cable' },
      { clave: 'Options',                  valor: 'Antenna bracket OP03-209, external buzzer OP-3-21, NMEA data converter IF-NMEA2K2, flush mount kit, Ethernet hub HUB-101' },
    ],
    destacados: [
      { titulo: 'Fully automatic gain',   desc: 'Adjusts gain, sea and rain clutter automatically and removes unnecessary echoes.' },
      { titulo: 'Fast Target Tracking™',  desc: 'Acquires and tracks 10 targets and shows their course and speed vector within seconds.' },
      { titulo: 'AIS display',            desc: 'With a Furuno FA-30 or FA-50 AIS, shows up to 100 AIS targets on the radar.' },
      { titulo: 'True Trail',             desc: 'Moving targets leave a graded trail that shows their movement at a glance.' },
      { titulo: 'Up to 3 displays',       desc: 'Three RDP-157 displays connected to a single antenna through an Ethernet hub.' },
      { titulo: 'Swivel mount',           desc: 'The gimbal bracket lets you angle the display for comfortable viewing.' },
    ],
    chips: [
      { valor: '8.4', unidad: '"',  label: 'Color VGA LCD' },
      { valor: '4', unidad: 'kW',   label: '19" radome' },
      { valor: '36', unidad: 'NM',  label: 'Max. range' },
      { valor: '10', unidad: '',    label: 'TT targets' },
    ],
    galeriaAlt: [
      'Furuno MODEL 1815 radar, front view',
      'MODEL 1815, angled view on its bracket',
      'MODEL 1815 screen with target tracking (official brochure)',
      'Display swivel bracket',
    ],
  },

  'gps-plotter':            { nombre: 'GPS / Chart plotter',     subcategoria: 'GPS / Chart plotter', resumen: 'Positioning and electronic charting.' },
  'piloto-automatico':      { nombre: 'Autopilot',               subcategoria: 'Autopilot',           resumen: 'Automatic heading control.' },
  'pantalla-multifuncion':  { nombre: 'Multifunction display',   subcategoria: 'Multifunction display', resumen: 'Combines sounder, radar and charts on a single screen.' },
  'radio-vhf':              { nombre: 'VHF radio',               subcategoria: 'Radiotelephone',      resumen: 'Marine VHF band communication with DSC.' },
  'transponder-ais':        { nombre: 'AIS transponder',         subcategoria: 'AIS',                 resumen: 'Automatic identification of vessels.' },
  'comunicacion-satelital': { nombre: 'Satellite communication', subcategoria: 'Satellite',           resumen: 'Voice and data beyond coastal coverage.' },
  'radiobaliza-epirb':      { nombre: 'EPIRB emergency beacon',  subcategoria: 'Emergency',           resumen: 'Emergency beacon with satellite positioning.' },
  'registrador-vdr':        { nombre: 'VDR voyage data recorder', subcategoria: 'VDR',                resumen: 'Voyage data recording as required by regulations.' },
  'antena-gps':             { nombre: 'GPS antenna',             subcategoria: 'Antenna',             resumen: 'Receiving antenna for positioning systems.' },
  'cableado-conectores':    { nombre: 'Cables and connectors',   subcategoria: 'Installation',        resumen: 'Installation supplies for marine electronics.' },
  'sensores-captura':       { nombre: 'Catch sensors',           subcategoria: 'Gear monitoring',     resumen: 'Real-time monitoring of the fishing gear and the catch volume.' },
  'ploter-cartografico':    { nombre: 'Chart plotter',           subcategoria: 'GPS / Chart plotter', resumen: 'Navigation with built-in charts for small craft.' },
  'radio-hf':               { nombre: 'HF / SSB radio',          subcategoria: 'Radiotelephone',      resumen: 'Long-range communication on the marine HF band.' },
};
