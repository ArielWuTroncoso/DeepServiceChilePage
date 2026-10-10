-- Marca si la persona ya vio la ventana de bienvenida de su perfil.
ALTER TABLE usuario ADD COLUMN IF NOT EXISTS bienvenida_vista BOOLEAN NOT NULL DEFAULT FALSE;
