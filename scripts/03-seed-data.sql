-- Insertar usuario admin por defecto
insert into users (dni, nombre, rol) values 
('12345678', 'Administrador UNICEN', 'admin');

-- Insertar algunos usuarios de ejemplo
insert into users (dni, nombre, rol, es_vegetariano, es_celiaco) values 
('87654321', 'Juan Pérez', 'usuario', false, false),
('11223344', 'María García', 'usuario', true, false),
('55667788', 'Carlos López', 'usuario', false, true);

-- Insertar menú de ejemplo para hoy
insert into menus (fecha, estado) values 
(current_date, 'confirmado');

-- Obtener el ID del menú creado
do $$
declare
  menu_id_var uuid;
begin
  select id into menu_id_var from menus where fecha = current_date;
  
  -- Insertar platos de ejemplo
  insert into platos (menu_id, tipo, nombre, descripcion) values 
  (menu_id_var, 'general', 'Milanesa con puré', 'Milanesa de carne con puré de papas y ensalada'),
  (menu_id_var, 'vegetariano', 'Tarta de verduras', 'Tarta casera con verduras de estación'),
  (menu_id_var, 'celiaco', 'Pollo grillado sin gluten', 'Pechuga de pollo a la plancha con vegetales');
end $$;
