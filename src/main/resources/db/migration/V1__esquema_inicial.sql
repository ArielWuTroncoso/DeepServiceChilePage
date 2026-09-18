-- ============================================================================
-- Deep Service Chile — esquema inicial (PostgreSQL)
-- Se aplica solo si FLYWAY_ENABLED=true. En desarrollo basta JPA_DDL_AUTO=update.
-- ============================================================================

CREATE TABLE IF NOT EXISTS rol (
    id     BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS usuario (
    id               BIGSERIAL PRIMARY KEY,
    nombre           VARCHAR(150) NOT NULL,
    correo           VARCHAR(180) NOT NULL UNIQUE,
    contrasena_hash  VARCHAR(255) NOT NULL,
    telefono         VARCHAR(30),
    empresa          VARCHAR(150),
    activo           BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS usuario_rol (
    usuario_id BIGINT NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    rol_id     BIGINT NOT NULL REFERENCES rol(id)     ON DELETE CASCADE,
    PRIMARY KEY (usuario_id, rol_id)
);

CREATE TABLE IF NOT EXISTS categoria (
    id          BIGSERIAL PRIMARY KEY,
    slug        VARCHAR(60)  NOT NULL UNIQUE,
    nombre      VARCHAR(120) NOT NULL,
    descripcion VARCHAR(400),
    icono       VARCHAR(40),
    orden       INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS marca (
    id          BIGSERIAL PRIMARY KEY,
    slug        VARCHAR(60)  NOT NULL UNIQUE,
    nombre      VARCHAR(120) NOT NULL,
    descripcion VARCHAR(400),
    logo_url    VARCHAR(400),
    destacada   BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS producto (
    id             BIGSERIAL PRIMARY KEY,
    slug           VARCHAR(140) NOT NULL UNIQUE,
    nombre         VARCHAR(160) NOT NULL,
    subcategoria   VARCHAR(120),
    resumen        VARCHAR(600),
    descripcion    TEXT,
    imagen_url     VARCHAR(500),          -- null mientras no haya material grafico
    destacado      BOOLEAN NOT NULL DEFAULT FALSE,
    completo       BOOLEAN NOT NULL DEFAULT FALSE,
    activo         BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    categoria_id   BIGINT NOT NULL REFERENCES categoria(id),
    marca_id       BIGINT NOT NULL REFERENCES marca(id)
);

CREATE INDEX IF NOT EXISTS idx_producto_categoria ON producto(categoria_id);
CREATE INDEX IF NOT EXISTS idx_producto_marca     ON producto(marca_id);
CREATE INDEX IF NOT EXISTS idx_producto_activo    ON producto(activo);

CREATE TABLE IF NOT EXISTS especificacion (
    id          BIGSERIAL PRIMARY KEY,
    clave       VARCHAR(120) NOT NULL,
    valor       VARCHAR(300) NOT NULL,
    orden       INTEGER NOT NULL DEFAULT 0,
    producto_id BIGINT NOT NULL REFERENCES producto(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_especificacion_producto ON especificacion(producto_id);

CREATE TABLE IF NOT EXISTS solicitud_contacto (
    id             BIGSERIAL PRIMARY KEY,
    nombre         VARCHAR(150) NOT NULL,
    empresa        VARCHAR(150),
    correo         VARCHAR(180) NOT NULL,
    telefono       VARCHAR(30),
    embarcacion    VARCHAR(180),
    interes        VARCHAR(80),
    producto_slug  VARCHAR(140),
    mensaje        TEXT NOT NULL,
    atendida       BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_solicitud_fecha ON solicitud_contacto(fecha_creacion DESC);
