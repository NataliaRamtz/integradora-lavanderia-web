-- Function: register_encargado
-- Ejecutar este script en el editor SQL de Supabase para permitir que un usuario recién registrado
-- cree su lavandería y el rol de encargado sin necesidad de la service role key en el front.

create extension if not exists "uuid-ossp";

create or replace function public.register_encargado(
  p_auth_user_id uuid,
  p_lavanderia_nombre text,
  p_slug_base text,
  p_first_name text,
  p_last_name text,
  p_phone text
) returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_slug_base text := nullif(trim(lower(coalesce(p_slug_base, ''))), '');
  v_slug_candidate text;
  v_attempts int := 0;
  v_lavanderia_id uuid;
begin
  if p_auth_user_id is null then
    raise exception 'auth_user_id is required';
  end if;

  if v_slug_base is null then
    v_slug_base := 'lavanderia-' || substr(replace(uuid_generate_v4()::text, '-', ''), 1, 8);
  end if;

  loop
    v_slug_candidate := case when v_attempts = 0 then v_slug_base else v_slug_base || '-' || v_attempts::text end;

    begin
      insert into public.lavanderias (nombre, slug, config)
      values (p_lavanderia_nombre, v_slug_candidate, '{}'::jsonb)
      returning id into v_lavanderia_id;
      exit;
    exception when unique_violation then
      v_attempts := v_attempts + 1;
      if v_attempts > 10 then
        raise exception 'No se pudo generar un slug único para la lavandería';
      end if;
    end;
  end loop;

  insert into public.perfiles_app (usuario_id, perfil, preferencias, activo)
  values (
    p_auth_user_id,
    jsonb_build_object(
      'nombre', p_first_name,
      'apellido', coalesce(p_last_name, ''),
      'telefono', coalesce(p_phone, '')
    ),
    '{}'::jsonb,
    true
  )
  on conflict (usuario_id) do update
    set perfil = excluded.perfil,
        preferencias = excluded.preferencias,
        activo = true,
        updated_at = now();

  begin
    insert into public.roles_app (usuario_id, lavanderia_id, rol, activo)
    values (p_auth_user_id, v_lavanderia_id, 'encargado', true);
  exception when unique_violation then
    null;
  end;

  return json_build_object('lavanderia_id', v_lavanderia_id, 'slug', v_slug_candidate);
end;
$$;

revoke all on function public.register_encargado(uuid, text, text, text, text, text) from public;
grant execute on function public.register_encargado(uuid, text, text, text, text, text) to authenticated;
