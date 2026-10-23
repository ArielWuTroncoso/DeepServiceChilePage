# Deep Service Chile

Sitio web oficial de **Deep Service Chile**, empresa de Talcahuano (Región del Biobío)
dedicada a las **soluciones y respaldo técnico en equipos electrónicos marinos asociados
a la navegación y la pesca**.

El sitio presenta a la empresa, sus servicios y su catálogo de equipos, y le permite a los
clientes pedir una cotización. Además incluye un **panel privado de administración** para que
el equipo gestione los mensajes recibidos, el stock y los equipos del catálogo.

---

## La empresa

Deep Service Chile es **entidad técnica aprobada por la administración chilena** y atiende a
lanchas pesqueras artesanales, barcos de pesca industrial, agencias navieras, embarcaciones
fleteras y remolcadores, y barcos mercantes.

**Servicios**

- Mantenimiento de sonares Furuno
- Instalación y puesta en marcha de equipos
- Mantenimiento de antenas de radar Furuno
- Inspecciones y certificaciones GMDSS, AIS, SART y RLS
- Software de navegación y cartas de pesca
- Puesta en marcha del sonar en zona de pesca
- Detección de fallas y reparaciones

**Marcas con las que trabaja:** Furuno, Garmin, Icom, ACR y Marport.

**Contacto**

| | |
|---|---|
| Dirección | Volcán Hornopirén 274, Talcahuano, Región del Biobío |
| Oficina | +56 41 299 5468 |
| Ejecutivos | Mario Martínez · +56 9 9847 5020 — Cristian Villanueva · +56 9 9844 3485 |
| Correo | contacto@deepservicechile.cl |
| Horario | Lunes a viernes, 9:00 a 18:00 h |
| Instagram | @deep_service_chile |

---

## Qué incluye el sitio

**Sitio público** (en español e inglés, con tema claro y oscuro)

- **Inicio**, **Nosotros**, **Servicios** y **Marcas**; el inicio también muestra a qué tipo de
  embarcaciones atendemos.
- **Catálogo** de equipos por categoría, con ficha técnica de cada uno y botón para cotizarlo.
- **Contacto**: formulario de consulta, datos de la empresa y mapa con cómo llegar.
- Videos de equipos y de trabajo en faena.

**Panel de administración** (acceso reservado, fuera de los buscadores)

- **Mensajes**: todas las consultas que dejan los clientes, con su texto completo, datos de
  contacto, filtros y marca de "atendida".
- **Inventario**: stock de cada equipo con botones para aumentar o disminuir, motivo de cada
  movimiento e historial. Incluye un buscador con selector en cascada (categoría → marca →
  producto) para encontrar equipos rápido.
- **Catálogo**: crear equipos nuevos, editarlos y darlos de baja; los cambios se reflejan en
  el sitio público.
- **Mi cuenta**: cambio de contraseña.

---

## Privacidad y seguridad

Los datos de clientes y de inventario solo se pueden ver con una sesión de administrador.

- El público solo puede **enviar** una consulta; no puede leer ni listar nada.
- Las sesiones duran 8 horas y se cierran solas tras 30 minutos sin actividad.
- Límite de intentos de acceso y de envíos para frenar abusos y ataques de adivinación.
- Contraseñas almacenadas con cifrado; se exige una contraseña robusta y se obliga a
  cambiar la inicial en el primer ingreso.
- El registro de nuevos administradores requiere un código reservado.
- Cabeceras de seguridad en el sitio y mensajes de error que no revelan información interna.

---

## Tecnología

- **Sitio:** React y Vite, con tipografías propias (sin servicios externos).
- **Servidor:** Spring Boot (Java 21), con acceso por sesión firmada (JWT).
- **Base de datos:** PostgreSQL en producción; migraciones automáticas con Flyway.
- **Publicación:** Docker y Render (`render.yaml`).

---

## Puesta en marcha

Requisitos: Node.js, Java 21 y Maven.

```bash
cp .env.example .env     # completar los valores indicados abajo
npm install

./mvnw spring-boot:run   # servidor en http://localhost:8080
npm run dev              # sitio en http://localhost:5173
```

### Variables importantes

| Variable | Para qué sirve |
|---|---|
| `JWT_SECRET` | Clave secreta de las sesiones. **Obligatoria en producción**: texto largo y aleatorio (32 caracteres o más). Si falta, el servidor usa una clave temporal y las sesiones se pierden al reiniciar. |
| `ADMIN_REGISTRO_CODIGO` | Código reservado para crear cuentas de administrador. Sin él, nadie puede registrarse como administrador. |
| `ADMIN_INICIAL_CORREO` y `ADMIN_INICIAL_CLAVE` | Opcionales. Crean el primer administrador al iniciar. La clave debe tener entre 8 y 72 caracteres, con mayúscula, minúscula, número y símbolo, sin espacios. |

La base de datos y el resto de los ajustes están documentados en `.env.example`.
En Render, las variables se definen en el panel del servicio (`render.yaml` deja la base
preparada).

---

## Pruebas

```bash
npm test -- --run
```

---

© Deep Service Chile — Talcahuano, Chile.
