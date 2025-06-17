-- Habilitar RLS en todas las tablas
alter table users enable row level security;
alter table menus enable row level security;
alter table platos enable row level security;
alter table reservas enable row level security;

-- Políticas para users - permitir inserción para nuevos usuarios
create policy "Anyone can insert users" on users
  for insert with check (true);

create policy "Users can view their own profile" on users
  for select using (auth.uid()::text = id::text OR dni = current_setting('app.current_user_dni', true));

create policy "Users can update their own profile" on users
  for update using (auth.uid()::text = id::text OR dni = current_setting('app.current_user_dni', true));

-- Políticas para menus (todos pueden ver)
create policy "Anyone can view menus" on menus
  for select to authenticated using (true);

create policy "Only admins can manage menus" on menus
  for all using (
    exists (
      select 1 from users 
      where (auth.uid()::text = id::text OR dni = current_setting('app.current_user_dni', true))
      and rol = 'admin'
    )
  );

-- Políticas para platos (todos pueden ver)
create policy "Anyone can view platos" on platos
  for select to authenticated using (true);

create policy "Only admins can manage platos" on platos
  for all using (
    exists (
      select 1 from users 
      where (auth.uid()::text = id::text OR dni = current_setting('app.current_user_dni', true))
      and rol = 'admin'
    )
  );

-- Políticas para reservas
create policy "Users can view their own reservas" on reservas
  for select using (
    user_id = (
      select id from users 
      where auth.uid()::text = id::text OR dni = current_setting('app.current_user_dni', true)
    )
  );

create policy "Users can create their own reservas" on reservas
  for insert with check (
    user_id = (
      select id from users 
      where auth.uid()::text = id::text OR dni = current_setting('app.current_user_dni', true)
    )
  );

create policy "Users can delete their own reservas" on reservas
  for delete using (
    user_id = (
      select id from users 
      where auth.uid()::text = id::text OR dni = current_setting('app.current_user_dni', true)
    )
  );

-- Admins pueden ver todas las reservas
create policy "Admins can view all reservas" on reservas
  for select using (
    exists (
      select 1 from users 
      where (auth.uid()::text = id::text OR dni = current_setting('app.current_user_dni', true))
      and rol = 'admin'
    )
  );
