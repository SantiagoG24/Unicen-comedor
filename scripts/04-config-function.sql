-- Función para establecer configuración de sesión
create or replace function set_config(setting_name text, setting_value text, is_local boolean default false)
returns text as $$
begin
  perform set_config(setting_name, setting_value, is_local);
  return setting_value;
end;
$$ language plpgsql security definer;

-- Dar permisos para usar la función
grant execute on function set_config(text, text, boolean) to authenticated;
grant execute on function set_config(text, text, boolean) to anon;
