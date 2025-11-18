-- ============================================================================
-- Script de Creación de Usuarios de Prueba
-- ============================================================================
-- Este script te ayuda a crear usuarios de prueba con diferentes roles
-- 
-- PREREQUISITO:
-- 1. Los usuarios deben registrarse primero desde la app (para crear auth.users)
-- 2. Debe existir al menos una lavandería en la tabla lavanderias
-- 
-- INSTRUCCIONES:
-- 1. Registra usuarios desde la app con estos emails:
--    - cliente@test.com (password: 123456)
--    - encargado@test.com (password: 123456)
--    - repartidor@test.com (password: 123456)
--    - admin@test.com (password: 123456)
-- 
-- 2. Ejecuta este script en Supabase SQL Editor
-- ============================================================================

-- ----------------------------------------------------------------------------
-- PASO 1: Verificar usuarios registrados
-- ----------------------------------------------------------------------------

SELECT 
  u.id,
  u.email,
  u.created_at,
  p.perfil->>'nombre' as nombre
FROM auth.users u
LEFT JOIN perfiles_app p ON u.id = p.usuario_id
WHERE u.email IN (
  'cliente@test.com',
  'encargado@test.com',
  'repartidor@test.com',
  'admin@test.com'
)
ORDER BY u.created_at;

-- Si no aparecen, regístralos primero desde la app

-- ----------------------------------------------------------------------------
-- PASO 2: Verificar lavanderías disponibles
-- ----------------------------------------------------------------------------

SELECT id, nombre, slug
FROM lavanderias
ORDER BY created_at
LIMIT 5;

-- Necesitas al menos una lavandería para asignar roles

-- ----------------------------------------------------------------------------
-- PASO 3: Asignar Roles
-- ----------------------------------------------------------------------------

-- 3.1. CLIENTE (no necesita rol en roles_app, es el default)
-- El usuario cliente@test.com ya funciona como cliente sin asignar rol

-- 3.2. ENCARGADO de la primera lavandería
INSERT INTO roles_app (usuario_id, lavanderia_id, rol, activo)
SELECT 
  u.id as usuario_id,
  (SELECT id FROM lavanderias ORDER BY created_at LIMIT 1) as lavanderia_id,
  'encargado' as rol,
  true as activo
FROM auth.users u
WHERE u.email = 'encargado@test.com'
ON CONFLICT (usuario_id, rol, lavanderia_id) 
WHERE (lavanderia_id IS NOT NULL)
DO UPDATE SET 
  activo = EXCLUDED.activo;

-- 3.3. REPARTIDOR de la primera lavandería
INSERT INTO roles_app (usuario_id, lavanderia_id, rol, activo)
SELECT 
  u.id as usuario_id,
  (SELECT id FROM lavanderias ORDER BY created_at LIMIT 1) as lavanderia_id,
  'repartidor' as rol,
  true as activo
FROM auth.users u
WHERE u.email = 'repartidor@test.com'
ON CONFLICT (usuario_id, rol, lavanderia_id) 
WHERE (lavanderia_id IS NOT NULL)
DO UPDATE SET 
  activo = EXCLUDED.activo;

-- 3.4. SUPERADMIN (acceso global, sin lavandería)
INSERT INTO roles_app (usuario_id, lavanderia_id, rol, activo)
SELECT 
  u.id as usuario_id,
  NULL as lavanderia_id,  -- NULL = acceso global
  'superadmin' as rol,
  true as activo
FROM auth.users u
WHERE u.email = 'admin@test.com'
ON CONFLICT (usuario_id, rol) 
WHERE (lavanderia_id IS NULL)
DO UPDATE SET 
  activo = EXCLUDED.activo;

-- ----------------------------------------------------------------------------
-- PASO 4: Verificar asignaciones
-- ----------------------------------------------------------------------------

SELECT 
  u.email,
  p.perfil->>'nombre' as nombre,
  r.rol,
  l.nombre as lavanderia,
  r.activo
FROM auth.users u
LEFT JOIN perfiles_app p ON u.id = p.usuario_id
LEFT JOIN roles_app r ON u.id = r.usuario_id
LEFT JOIN lavanderias l ON r.lavanderia_id = l.id
WHERE u.email IN (
  'cliente@test.com',
  'encargado@test.com',
  'repartidor@test.com',
  'admin@test.com'
)
ORDER BY 
  CASE r.rol
    WHEN 'superadmin' THEN 1
    WHEN 'encargado' THEN 2
    WHEN 'repartidor' THEN 3
    WHEN 'cliente' THEN 4
    ELSE 5
  END;

-- ----------------------------------------------------------------------------
-- PASO 5 (OPCIONAL): Crear usuario con múltiples roles
-- ----------------------------------------------------------------------------

-- Ejemplo: Usuario que es encargado en Lavandería 1 y repartidor en Lavandería 2
-- Primero registra multi@test.com desde la app

INSERT INTO roles_app (usuario_id, lavanderia_id, rol, activo)
SELECT 
  u.id as usuario_id,
  l.id as lavanderia_id,
  'encargado' as rol,
  true as activo
FROM auth.users u
CROSS JOIN (SELECT id FROM lavanderias ORDER BY created_at LIMIT 1 OFFSET 0) l
WHERE u.email = 'multi@test.com'
ON CONFLICT (usuario_id, rol, lavanderia_id) 
WHERE (lavanderia_id IS NOT NULL)
DO UPDATE SET activo = EXCLUDED.activo;

INSERT INTO roles_app (usuario_id, lavanderia_id, rol, activo)
SELECT 
  u.id as usuario_id,
  l.id as lavanderia_id,
  'repartidor' as rol,
  true as activo
FROM auth.users u
CROSS JOIN (SELECT id FROM lavanderias ORDER BY created_at LIMIT 1 OFFSET 1) l
WHERE u.email = 'multi@test.com'
ON CONFLICT (usuario_id, rol, lavanderia_id) 
WHERE (lavanderia_id IS NOT NULL)
DO UPDATE SET activo = EXCLUDED.activo;

-- ----------------------------------------------------------------------------
-- QUERIES ÚTILES PARA DEBUGGING
-- ----------------------------------------------------------------------------

-- Ver todos los usuarios con sus roles
SELECT 
  u.email,
  u.id as auth_user_id,
  p.id as perfil_id,
  p.perfil->>'nombre' as nombre,
  r.id as rol_id,
  r.rol,
  r.lavanderia_id,
  l.nombre as lavanderia,
  r.activo as rol_activo,
  p.activo as perfil_activo
FROM auth.users u
LEFT JOIN perfiles_app p ON u.id = p.usuario_id
LEFT JOIN roles_app r ON u.id = r.usuario_id
LEFT JOIN lavanderias l ON r.lavanderia_id = l.id
ORDER BY u.created_at DESC;

-- Contar usuarios por rol
SELECT 
  COALESCE(r.rol::text, 'sin_rol') as rol,
  COUNT(DISTINCT u.id) as cantidad
FROM auth.users u
LEFT JOIN roles_app r ON u.id = r.usuario_id AND r.activo = true
GROUP BY COALESCE(r.rol::text, 'sin_rol')
ORDER BY cantidad DESC;

-- Ver usuarios sin perfil (error de registro)
SELECT 
  u.id,
  u.email,
  u.created_at
FROM auth.users u
LEFT JOIN perfiles_app p ON u.id = p.usuario_id
WHERE p.id IS NULL;

-- Ver usuarios sin roles activos
SELECT 
  u.id,
  u.email,
  p.perfil->>'nombre' as nombre
FROM auth.users u
LEFT JOIN perfiles_app p ON u.id = p.usuario_id
LEFT JOIN roles_app r ON u.id = r.usuario_id AND r.activo = true
WHERE r.id IS NULL
ORDER BY u.created_at DESC;

-- ----------------------------------------------------------------------------
-- LIMPIEZA (usar con cuidado)
-- ----------------------------------------------------------------------------

-- Desactivar todos los roles de un usuario específico
-- UPDATE roles_app 
-- SET activo = false 
-- WHERE usuario_id = 'USER_ID_AQUI';

-- Eliminar todos los roles de prueba (sin afectar usuarios)
-- DELETE FROM roles_app 
-- WHERE usuario_id IN (
--   SELECT id FROM auth.users 
--   WHERE email LIKE '%@test.com'
-- );

-- Eliminar usuarios de prueba completamente (CASCADE eliminará perfiles y roles)
-- DELETE FROM auth.users 
-- WHERE email IN (
--   'cliente@test.com',
--   'encargado@test.com',
--   'repartidor@test.com',
--   'admin@test.com'
-- );

-- ============================================================================
-- NOTAS IMPORTANTES
-- ============================================================================

-- 1. ORDEN DE OPERACIONES:
--    a) Registrar usuarios desde la app
--    b) Ejecutar este script para asignar roles
--    c) Hacer login y verificar redirección

-- 2. ROLES Y PERMISOS:
--    - cliente: Sin entrada en roles_app (default)
--    - repartidor: Acceso a entregas de una lavandería
--    - encargado: Gestión completa de una lavandería
--    - superadmin: Acceso global (lavanderia_id = NULL)

-- 3. CONSTRAINTS ÚNICOS:
--    - ux_roles_app_por_lav: UNIQUE(usuario_id, rol, lavanderia_id) cuando lavanderia_id NO es NULL
--    - ux_roles_app_global: UNIQUE(usuario_id, rol) cuando lavanderia_id ES NULL
--    - Un usuario PUEDE tener múltiples roles en la MISMA lavandería
--    - Un usuario NO puede tener el MISMO rol duplicado en una lavandería

-- 4. RLS (Row Level Security):
--    - Asegúrate de que las políticas RLS permitan acceso según rol
--    - Revisa docs/security-rls.md para más información

-- 5. TESTING:
--    - Usa diferentes dispositivos/navegadores para probar roles simultáneos
--    - Verifica redirección correcta después de login
--    - Comprueba permisos de cada rol

-- ============================================================================
