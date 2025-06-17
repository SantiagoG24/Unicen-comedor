-- Deshabilitar RLS en la tabla users para permitir inserciones
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Limpiar políticas existentes de users
DROP POLICY IF EXISTS "Anyone can insert users" ON users;
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;

-- Mantener RLS en otras tablas pero simplificar las políticas
-- Políticas para menus
DROP POLICY IF EXISTS "Anyone can view menus" ON menus;
DROP POLICY IF EXISTS "Only admins can manage menus" ON menus;

CREATE POLICY "Anyone can view menus" ON menus
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage menus" ON menus
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE dni = current_setting('app.current_user_dni', true)
      AND rol = 'admin'
    )
  );

-- Políticas para platos
DROP POLICY IF EXISTS "Anyone can view platos" ON platos;
DROP POLICY IF EXISTS "Only admins can manage platos" ON platos;

CREATE POLICY "Anyone can view platos" ON platos
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage platos" ON platos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE dni = current_setting('app.current_user_dni', true)
      AND rol = 'admin'
    )
  );

-- Políticas para reservas
DROP POLICY IF EXISTS "Users can view their own reservas" ON reservas;
DROP POLICY IF EXISTS "Users can create their own reservas" ON reservas;
DROP POLICY IF EXISTS "Users can delete their own reservas" ON reservas;
DROP POLICY IF EXISTS "Admins can view all reservas" ON reservas;

CREATE POLICY "Users can manage their own reservas" ON reservas
  FOR ALL USING (
    user_id IN (
      SELECT id FROM users 
      WHERE dni = current_setting('app.current_user_dni', true)
    )
  );

CREATE POLICY "Admins can view all reservas" ON reservas
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE dni = current_setting('app.current_user_dni', true)
      AND rol = 'admin'
    )
  );
