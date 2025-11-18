create or replace function public.admin_update_lavanderia(
  p_id uuid,
  p_nombre text,
  p_descripcion text,
  p_config jsonb,
  p_lat numeric,
  p_lng numeric
) returns public.lavanderias
language plpgsql
security definer
set search_path = public
as $$
declare
  v_is_superadmin boolean;
  v_has_access boolean;
  v_result public.lavanderias;
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
    select exists (
      select 1
      from public.roles_app
      where usuario_id = auth.uid()
        and rol in ('superadmin', 'encargado')
        and activo = true
        and lavanderia_id = p_id
    )
    into v_has_access;

    if not v_has_access then
      raise exception 'No tienes permisos para actualizar esta lavandería.';
    end if;
  end if;

  update public.lavanderias
  set nombre = coalesce(p_nombre, nombre),
      descripcion = p_descripcion,
      config = coalesce(p_config, config),
      lat = p_lat,
      lng = p_lng,
      updated_at = now()
  where id = p_id
  returning * into v_result;

  if not found then
    raise exception 'No pudimos actualizar la lavandería indicada.';
  end if;

  return v_result;
end;
$$;

revoke all on function public.admin_update_lavanderia(uuid, text, text, jsonb, numeric, numeric) from public;
grant execute on function public.admin_update_lavanderia(uuid, text, text, jsonb, numeric, numeric) to authenticated;
