-- Function: admin_get_encargado_email
-- Description: Obtiene el email y usuario_id del encargado activo de una lavandería
-- Security: Solo usuarios autenticados pueden ejecutar esta función

drop function if exists public.admin_get_encargado_email(uuid);

create or replace function public.admin_get_encargado_email(p_lavanderia_id uuid)
returns table (
  email text,
  usuario_id uuid
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_usuario_id uuid;
  v_email text;
begin
  -- Obtener el usuario_id del encargado activo de la lavandería
  select ra.usuario_id
  into v_usuario_id
  from public.roles_app ra
  where ra.lavanderia_id = p_lavanderia_id
    and ra.rol = 'encargado'
    and ra.activo = true
  limit 1;

  if v_usuario_id is null then
    return query select null::text, null::uuid;
    return;
  end if;

  -- Obtener el email del usuario desde auth.users
  select au.email
  into v_email
  from auth.users au
  where au.id = v_usuario_id;

  return query select v_email, v_usuario_id;
end;
$$;

revoke all on function public.admin_get_encargado_email(uuid) from public;
grant execute on function public.admin_get_encargado_email(uuid) to authenticated;

