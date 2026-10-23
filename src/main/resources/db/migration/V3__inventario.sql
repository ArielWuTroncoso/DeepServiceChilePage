-- Inventario de stock, historial de movimientos y cierre de sesiones al cambiar la contrasena.
-- Ninguna de estas tablas se expone en la API publica: solo el panel de administracion las lee.

CREATE TABLE IF NOT EXISTS inventario (
    producto_id    BIGINT PRIMARY KEY REFERENCES producto(id) ON DELETE CASCADE,
    stock          INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    stock_minimo   INTEGER NOT NULL DEFAULT 0 CHECK (stock_minimo >= 0),
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Historial de auditoria: nunca se edita ni se borra. Sin clave foranea a proposito,
-- para que el registro sobreviva aunque un equipo se elimine algun dia.
CREATE TABLE IF NOT EXISTS movimiento_stock (
    id               BIGSERIAL PRIMARY KEY,
    producto_id      BIGINT NOT NULL,
    tipo             VARCHAR(10) NOT NULL CHECK (tipo IN ('ENTRADA', 'SALIDA', 'AJUSTE')),
    cantidad         INTEGER NOT NULL CHECK (cantidad >= 0),
    stock_resultante INTEGER NOT NULL CHECK (stock_resultante >= 0),
    motivo           VARCHAR(200),
    usuario          VARCHAR(180) NOT NULL,
    fecha            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_movimiento_producto_fecha ON movimiento_stock(producto_id, fecha DESC);

-- Las sesiones iniciadas antes de este instante dejan de valer (cambio de contrasena).
ALTER TABLE usuario ADD COLUMN IF NOT EXISTS clave_cambiada_en TIMESTAMPTZ;

-- Una fila de inventario (en 0) para cada equipo que ya existe.
INSERT INTO inventario (producto_id)
SELECT p.id FROM producto p
WHERE NOT EXISTS (SELECT 1 FROM inventario i WHERE i.producto_id = p.id);
