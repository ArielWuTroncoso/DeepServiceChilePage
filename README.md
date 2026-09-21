# Deep Service Chile — Sitio web

Sitio corporativo y catálogo de **Deep Service Chile**, empresa de soluciones y
respaldo técnico en equipos electrónicos marinos para navegación y pesca.

Construido sobre la misma arquitectura del proyecto **Abrazamente**: SPA de React
servida por una API REST de Spring Boot, desplegable en Render como dos servicios
separados o como uno solo.

---

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 19 · Vite · React Router 7 · Tailwind 4 · lucide-react · framer-motion |
| Tipografías | Autoalojadas con `@fontsource` (Inter + Barlow Condensed) |
| Backend | Spring Boot 3.4 · Java 21 · Spring Security + JWT · Spring Data JPA |
| Base de datos | PostgreSQL en producción · H2 en memoria en desarrollo |
| Migraciones | Flyway (opcional, `FLYWAY_ENABLED=true`) |
| Despliegue | Docker multi-stage · Render (`render.yaml`) |

---

## Puesta en marcha

```bash
cp .env.example .env      # ajusta lo que necesites
npm install

# Terminal 1 — API en http://localhost:8080
./mvnw spring-boot:run    # o: mvn spring-boot:run

# Terminal 2 — SPA en http://localhost:5173
npm run dev
```

Vite redirige `/api`, `/auth` y `/usuarios` al backend, así que en desarrollo no
hace falta configurar CORS.

Sin configuración extra levanta con **H2 en memoria** y siembra el catálogo de
ejemplo. Usuario administrador inicial:

```
correo:     admin@deepservicechile.cl
contraseña: DeepService2026        ← cambiar en el primer ingreso
```

---

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Compila el SPA en `src/main/resources/static` (servicio único) |
| `npm run build:spa` | Compila el SPA en `dist/` (frontend separado en Render) |
| `npm run lint` | Linter (oxlint) |
| `npm run test` | Pruebas (vitest) |

---

## Estructura

```
public/
├── marca/                      Logotipo oficial de Deep Service (blanco y azul)
├── marcas/                     Logotipos originales: furuno, garmin, icom, acr, marport
├── img/                        Fotografía de la bahía de San Vicente (sin uso actual)
├── productos/<slug>/NN.webp    Imágenes del catálogo (tarjeta + galería de cada ficha)
├── video/                      Videos de portada (AV1 .webm + H.264 .mp4) y sus pósters
└── favicon.ico · favicon.png · apple-touch-icon.png

src/
├── main.jsx · App.jsx          Arranque, tipografías y enrutado
├── index.css                   Sistema de diseño (tokens y primitivas)
├── styles/                     Hojas por área: layout, home, catálogo, formularios
├── context/                    AuthContext · ThemeContext (modo claro/oscuro)
├── services/                   apiClient, auth, catálogo, contacto
├── hooks/                      useReveal, useDocumentTitle
├── components/                 layout · common (Logo, MarcaSlot) · skeletons
├── features/catalogo/          Tarjeta de producto y filtros
├── data/                       empresa.js · catalogo.js (respaldo del frontend)
├── pages/                      Home, Productos, Producto, Servicios, Marcas,
│                               Nosotros, Contacto, Login, Registro, Admin, 404
└── main/java/cl/deepservice/   model · dto · repository · service · controller
                                security · exception · web · config
```

---

## Marca

El logotipo oficial vive en `public/marca/` en dos versiones, ambas con el óvalo
completo y sin deformación:

| Archivo | Uso |
|---|---|
| `deep-service-blanco.png` | Fondos oscuros (cabecera, pie) |
| `deep-service-azul.png` | Fondos claros y previsualizaciones sociales |

`src/components/layout/Logo.jsx` recibe la **altura** en píxeles y deriva el
ancho a partir de la proporción real del óvalo, de modo que nunca se distorsiona:

```jsx
<Logo size={48} />                    {/* versión blanca, fondos oscuros */}
<Logo size={64} variante="azul" />    {/* versión azul, fondos claros    */}
```

El nombre de marca se compone en Barlow Condensed junto al emblema:
**DEEP SERVICE** en blanco y **CHILE** en el azul de acento.

### Logotipos de las marcas representadas

`public/marcas/` contiene los logotipos originales de FURUNO, GARMIN, ICOM, ACR y
MARPORT, recortados y con fondo transparente. En `src/data/catalogo.js` cada marca
lleva `logo` (ruta) y `logoRatio` (ancho/alto). `MarcaSlot` usa esa proporción
para que todos ocupen una superficie visual parecida, y los muestra sobre una
placa blanca fija para respetar sus colores también en modo oscuro.

Para agregar una marca: dejar su PNG/SVG en `public/marcas/`, añadirla a `MARCAS`
con su `logoRatio` y, si debe existir en la base, a `DataSeeder.java`.

### Fotografías

| Archivo | Dónde | Notas |
|---|---|---|
| `img/bahia-san-vicente.webp/.jpg` | Disponible (antes en la portada) | 960 × 550, resolución nativa |
| `productos/furuno-fcv-800/01.webp` | Producto destacado de la portada y catálogo | Recorte sin fondo, 570 × 568 |

### Catálogo con imágenes y fichas técnicas

Fichas completas (`completo: true` en `src/data/catalogo.js`), traducidas y
verificadas contra la documentación oficial Furuno:

| Equipo | Fuente | Imágenes |
|---|---|---|
| FCV-800 · sonda de pesca | Folleto FCV-600/FCV-800 y furuno.es | 2 (ángulo, frente) |
| CH-500 · sonar de búsqueda | Folleto CH-500 (CA000002208) y furuno.com | 4 (equipo, frente, unidades de casco, pantalla) |
| CSH-5L MARK-2 · sonar de círculo completo | furuno.com, catálogo CSH-5L MARK-2 y furunousa.com | 1 |
| MODEL 1815 · radar 8,4" | Folleto MODEL1815 (CA000001676) y furuno.com | 4 (frente, ángulo, pantalla TT, soporte) |

Imágenes en `public/productos/<slug>/NN.webp`: fotos recortadas sin fondo (con
transparencia) o, para pantallas y banners, con su fondo y `ajuste: 'cubrir'`.
La ficha (`GaleriaProducto.jsx`) muestra la imagen principal a su tamaño real
como máximo —nunca la amplía— y miniaturas para cambiar de vista.

Para agregar un equipo: copiar el bloque de una ficha completa en
`src/data/catalogo.js`, dejar sus imágenes en `public/productos/<slug>/` y, si
debe existir en la base, replicarlo en `DataSeeder.java` con `ficha(...)`.

### Videos de portada

Carrusel en la portada (`src/components/home/HeroVideos.jsx`): se reproduce el
video del **sonar**; al terminar, el marco se desliza al del **plóter GPS**; al
terminar ése, vuelve al primero. Debajo hay un botón de pausa y un indicador por
video con su avance (también sirven para saltar de uno a otro).

Ambos archivos comparten la proporción horizontal del marco. El sonar se grabó en
vertical, así que va montado sobre una copia difuminada de sí mismo, sin recortar
el video original.

| Archivo | Peso | Quién lo descarga |
|---|---|---|
| `portada-sonar.webm` · `portada-gps.webm` (AV1) | 759 + 872 KB | Chrome, Edge, Firefox |
| `portada-sonar.mp4` · `portada-gps.mp4` (H.264) | 1.203 + 1.094 KB | Safari y equipos sin AV1 |
| `portada-*.webp` (póster) | 19 + 26 KB | Todos, al cargar |

Originales: 6,9 MB con audio. Codificación: sin audio, H.264 CRF 26 / AV1 CRF 38.

**Consumo** (plan Hobby de Render: 5 GB/mes):
- Al cargar sólo bajan los pósters. El 1.er video empieza cuando el marco está en
  pantalla; el 2.º se descarga recién cuando al 1.º le quedan 5 s.
- Visita que ve ambos: ~2,0 MB (AV1) / ~2,8 MB (Safari) → **~1.800 visitas nuevas
  al mes en el peor caso**. Quien se va antes de terminar el 1.er video gasta menos.
- Las vueltas siguientes del carrusel no vuelven a descargar.
- Con "ahorro de datos" o conexión 2G quedan los pósters fijos. "Reducir
  movimiento" **no** detiene los videos (el visitante tiene el botón de pausa).

Para reemplazar un video: mismo encuadre horizontal, **nombre nuevo** (por la
caché) y actualizar `CLIPS` en el componente.

### Cabecera

`--header-h` en `src/index.css` controla la altura (109 px en escritorio, 92 px en
móvil) y todo lo que depende de ella: el relleno superior del contenido, los
filtros y la galería fijos del catálogo. El alto del logo se ajusta en
`Header.jsx` (`size`) y en las media queries de `.hdr__mark`.

---

## Servicios

El contenido de la página de servicio técnico está tomado del sitio vigente
(`deepservicechile.cl/servicio.php`) y vive en `src/data/empresa.js`:

| Export | Contenido |
|---|---|
| `SERVICIOS` | Los siete servicios declarados, con sus modelos y alcances |
| `ENTIDAD_TECNICA` | Los cuatro servicios habilitados como entidad técnica aprobada |
| `CLIENTES` | Perfil de clientes (artesanal, industrial, navieras, mercantes) |
| `INTRO_SERVICIOS` · `LEMA` | Textos institucionales |

Editar ahí actualiza a la vez la portada, la página de servicio técnico y el pie.

---

## API

| Método | Ruta | Acceso |
|---|---|---|
| `GET` | `/api/salud` | público (healthcheck de Render) |
| `GET` | `/api/categorias` | público |
| `GET` | `/api/marcas` | público |
| `GET` | `/api/productos?categoria=&marca=&q=` | público |
| `GET` | `/api/productos/{slug}` | público |
| `POST` | `/api/productos` | ADMIN |
| `PUT` | `/api/productos/{id}` | ADMIN |
| `DELETE` | `/api/productos/{id}` | ADMIN (baja lógica) |
| `POST` | `/api/contacto` | público (formulario) |
| `GET` | `/api/contacto` | ADMIN |
| `PUT` | `/api/contacto/{id}/atender` | ADMIN |
| `POST` | `/usuarios` | público (registro) |
| `POST` | `/auth/login` | público |
| `GET` | `/auth/me` | autenticado |

---

## Despliegue en Render (dos servicios)

`render.yaml` define ambos. Tras el primer despliegue hay que cruzar las URLs:

1. **deep-service-backend** (Docker, `Dockerfile.backend`)
   `DB_URL`, `DB_USER`, `DB_PASSWORD`, `DB_DRIVER=org.postgresql.Driver`
   `FRONTEND_ORIGINS` = URL pública del frontend
   Health Check Path: `/api/salud`
2. **deep-service-frontend** (sitio estático, `npm run build:spa` → `dist/`)
   `VITE_API_URL` = URL pública del backend

Alternativa de **un solo servicio**: usa el `Dockerfile` de la raíz, que compila
el SPA dentro de los recursos estáticos de Spring Boot. En ese caso `VITE_API_URL`
queda vacío y `SpaController` resuelve las rutas del router.

> El backend ya trae datos sembrados. Si cambian las marcas o los productos en
> `DataSeeder.java`, hay que vaciar las tablas o subir la versión de Flyway para
> que la base los vuelva a cargar.

---

## Sistema de diseño

La paleta sale del afiche del FCV-800: **una sola familia de azul** (matiz ~205°)
con nueve peldaños de luminosidad. El contraste entre secciones se logra
alternando peldaños, no agregando colores.

| Token | Uso |
|---|---|
| `--b-950` `#06192B` | franjas ancla, pie |
| `--b-900` `#0A2743` | cabecera |
| `--b-700` `#16507A` | azul medio, superficies sobre oscuro |
| `--b-600` `#1C6699` | botones primarios, barras de sección |
| `--b-400` `#3BA2DC` | acento |
| `--paper` `#F5FAFD` | fondo claro |
| `--ink` `#082439` | texto principal |

Tipografías: **Barlow Condensed** para títulos, **Inter** para el resto. Ambas se
empaquetan con el sitio vía `@fontsource` (importadas en `src/main.jsx`), así que
no dependen de un servicio externo ni producen salto de fuente al cargar.

Primitivas reutilizadas del afiche: `.ds-barlabel` (barra azul de sección),
`.ds-chip` (ficha de dato técnico), `.ds-tri` (viñeta triangular),
`.ds-badge` (insignia de icono) y `.ds-dark` (bloque oscuro a sangre).

El sitio incluye **modo claro y oscuro**; el conmutador vive en la cabecera.

---

## Pendientes antes de publicar

- [ ] **Imágenes del catálogo**: FCV-800, CH-500, CSH-5L MARK-2 y MODEL 1815 ya
      tienen fotos y ficha completa; el resto sigue con marco vacío. Al cargar el material basta con completar
      `imagenUrl` en la API (o `imagen` en `src/data/catalogo.js`).
- [ ] **Fichas técnicas**: sólo el FCV-800 tiene especificaciones verificadas.
      El resto está marcado como *ficha en preparación*, y los productos asignados
      a GARMIN, ICOM, ACR y MARPORT son marcadores de estructura: hay que
      confirmar qué equipos de cada marca se ofrecen realmente.
- [ ] **Datos de contacto**: confirmar correo corporativo y dirección física en
      `src/data/empresa.js`.
- [ ] **Credencial del administrador**: cambiar la contraseña inicial.
