drop function if exists public.admin_list_usuarios();

create or replace function public.admin_list_usuarios()
returns table (
  id uuid,
  usuario_id uuid,
  rol public.app_rol,
  activo boolean,
  perfil jsonb,
  email text,
  lavanderia_id uuid,
  lavanderia_nombre text,
  created_at timestamptz,
  updated_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    ra.id,
    ra.usuario_id,
    ra.rol,
    ra.activo,
    coalesce(pa.perfil::jsonb, '{}'::jsonb) as perfil,
    u.email,
    ra.lavanderia_id,
    l.nombre as lavanderia_nombre,
    ra.created_at,
    ra.updated_at
  from public.roles_app ra
  left join public.perfiles_app pa on pa.usuario_id = ra.usuario_id
  left join auth.users u on u.id = ra.usuario_id
  left join public.lavanderias l on l.id = ra.lavanderia_id;
$$;

revoke all on function public.admin_list_usuarios() from public;
grant execute on function public.admin_list_usuarios() to authenticated;
