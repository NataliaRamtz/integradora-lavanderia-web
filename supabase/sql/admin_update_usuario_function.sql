create or replace function public.admin_update_usuario(
  p_usuario_app_id uuid,
  p_nombre text,
  p_apellido text,
  p_email text,
  p_telefono text,
  p_rol public.app_rol,
  p_activo boolean
) returns public.usuarios_app
language plpgsql
security definer
set search_path = public
as $$
declare
  v_is_superadmin boolean;
  v_perfil jsonb := '{}'::jsonb;
  v_existing_perfil jsonb;
  v_result public.usuarios_app;
begin
  select exists (
    select 1
    from public.roles_app
    where usuario_id = auth.uid()
      and rol = 'superadmin'
      and activo = true
  )
  into v_is_superadmin;

  if not v_is_superadmin then
    raise exception 'No tienes permisos para actualizar este usuario.';
  end if;

  select perfil::jsonb into v_existing_perfil
  from public.usuarios_app
  where id = p_usuario_app_id;

  if v_existing_perfil is not null then
    v_perfil := v_existing_perfil;
  end if;

  if p_nombre is not null then
    v_perfil := jsonb_set(v_perfil, '{nombre}', to_jsonb(p_nombre), true);
  end if;

  if p_apellido is not null then
    v_perfil := jsonb_set(v_perfil, '{apellido}', to_jsonb(p_apellido), true);
  end if;

  if p_email is not null then
    v_perfil := jsonb_set(v_perfil, '{email}', to_jsonb(p_email), true);
  end if;

  if p_telefono is not null then
    v_perfil := jsonb_set(v_perfil, '{telefono}', to_jsonb(p_telefono), true);
  end if;

  update public.usuarios_app
  set perfil = v_perfil,
      rol = coalesce(p_rol, rol),
      activo = coalesce(p_activo, activo),
      updated_at = now()
  where id = p_usuario_app_id
  returning * into v_result;

  if not found then
    raise exception 'No pudimos actualizar la información del usuario.';
  end if;

  return v_result;
end;
$$;

revoke all on function public.admin_update_usuario(uuid, text, text, text, text, public.app_rol, boolean) from public;
grant execute on function public.admin_update_usuario(uuid, text, text, text, text, public.app_rol, boolean) to authenticated;
