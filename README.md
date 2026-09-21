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
├── marcas/                     Logotipos de las marcas representadas (ver LEEME)
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

`public/marcas/` está preparada para recibir los archivos oficiales de FURUNO,
GARMIN, ICOM, ACR y MARPORT (ver `public/marcas/LEEME.txt`). Mientras el campo
`logo` de cada marca en `src/data/catalogo.js` sea `null`, el componente
`MarcaSlot` compone el nombre tipográficamente, que es una solución válida y no
deja huecos en la retícula.

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

- [ ] **Imágenes**: el catálogo queda deliberadamente sin fotografías. Cada tarjeta
      y ficha dibuja un marco vacío. Al cargar el material basta con completar
      `imagenUrl` en la API (o `imagen` en `src/data/catalogo.js`).
- [ ] **Logotipos de marcas**: dejar los archivos oficiales en `public/marcas/`
      y apuntar el campo `logo` de cada marca en `src/data/catalogo.js`.
- [ ] **Fichas técnicas**: sólo el FCV-800 tiene especificaciones verificadas.
      El resto está marcado como *ficha en preparación*, y los productos asignados
      a GARMIN, ICOM, ACR y MARPORT son marcadores de estructura: hay que
      confirmar qué equipos de cada marca se ofrecen realmente.
- [ ] **Datos de contacto**: confirmar correo corporativo y dirección física en
      `src/data/empresa.js`.
- [ ] **Credencial del administrador**: cambiar la contraseña inicial.
