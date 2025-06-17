-- Limpiar datos existentes
DELETE FROM reservas;
DELETE FROM platos;
DELETE FROM menus;
DELETE FROM users;

-- Insertar usuarios de prueba
INSERT INTO users (dni, nombre, rol, es_vegetariano, es_celiaco) VALUES 
('12345678', 'Administrador UNICEN', 'admin', false, false),
('87654321', 'Juan Pérez', 'usuario', false, false),
('11223344', 'María García', 'usuario', true, false),
('55667788', 'Carlos López', 'usuario', false, true),
('99887766', 'Ana Rodríguez', 'usuario', false, false);

-- Insertar menú para hoy
INSERT INTO menus (fecha, estado) VALUES 
(CURRENT_DATE, 'confirmado');

-- Obtener el ID del menú e insertar platos
DO $$
DECLARE
    menu_id_var uuid;
BEGIN
    SELECT id INTO menu_id_var FROM menus WHERE fecha = CURRENT_DATE;
    
    INSERT INTO platos (menu_id, tipo, nombre, descripcion) VALUES 
    (menu_id_var, 'general', 'Milanesa con puré', 'Milanesa de carne con puré de papas y ensalada mixta'),
    (menu_id_var, 'vegetariano', 'Tarta de verduras', 'Tarta casera con verduras de estación y queso'),
    (menu_id_var, 'celiaco', 'Pollo grillado sin gluten', 'Pechuga de pollo a la plancha con vegetales salteados');
END $$;

-- Verificar que los datos se insertaron correctamente
SELECT 'Usuarios creados:' as info, count(*) as cantidad FROM users
UNION ALL
SELECT 'Menús creados:', count(*) FROM menus
UNION ALL
SELECT 'Platos creados:', count(*) FROM platos;
