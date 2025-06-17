-- Tabla de usuarios
create table users (
  id uuid primary key default gen_random_uuid(),
  dni varchar(15) not null unique,
  nombre text not null,
  rol text check (rol in ('admin', 'usuario')) not null default 'usuario',
  es_vegetariano boolean default false,
  es_celiaco boolean default false,
  enfermedades text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Tabla de menús
create table menus (
  id uuid primary key default gen_random_uuid(),
  fecha date not null unique,
  estado text check (estado in ('confirmado', 'a confirmar')) not null default 'a confirmar',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Tabla de platos
create table platos (
  id uuid primary key default gen_random_uuid(),
  menu_id uuid references menus(id) on delete cascade,
  tipo text check (tipo in ('vegetariano', 'celiaco', 'general')) not null,
  nombre text not null,
  descripcion text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  unique (menu_id, tipo)
);

-- Tabla de reservas
create table reservas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  plato_id uuid references platos(id) on delete cascade,
  fecha date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  unique (user_id, fecha, plato_id)
);

-- Restricción: Máximo 2 reservas por usuario por día
create or replace function check_max_reservas()
returns trigger as $$
begin
  if (select count(*) from reservas where user_id = new.user_id and fecha = new.fecha) >= 2 then
    raise exception 'Solo se pueden hacer 2 reservas por día';
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trg_max_reservas
before insert on reservas
for each row execute function check_max_reservas();
