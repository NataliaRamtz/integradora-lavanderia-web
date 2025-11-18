-- Script para corregir las políticas RLS de la tabla servicios
-- Este script asegura que los encargados puedan actualizar servicios

-- 1. Eliminar políticas existentes
DROP POLICY IF EXISTS "Anyone can view active servicios" ON servicios;
DROP POLICY IF EXISTS "Encargados can view all servicios" ON servicios;
DROP POLICY IF EXISTS "Encargados can manage servicios" ON servicios;
DROP POLICY IF EXISTS "Encargados can insert servicios" ON servicios;
DROP POLICY IF EXISTS "Encargados can update servicios" ON servicios;
DROP POLICY IF EXISTS "Encargados can delete servicios" ON servicios;

-- 2. Crear políticas corregidas

-- Lectura: servicios activos (público)
CREATE POLICY "Anyone can view active servicios" ON servicios
  FOR SELECT
  USING (activo = true);

-- Encargados ven todos (incluso inactivos)
CREATE POLICY "Encargados can view all servicios" ON servicios
  FOR SELECT
  USING (
    lavanderia_id IN (
      SELECT r.lavanderia_id 
      FROM roles_app r
      WHERE r.usuario_id = auth.uid()
        AND r.rol IN ('encargado', 'superadmin')
        AND r.activo = true
    )
  );

-- Escritura: solo encargados (INSERT, UPDATE, DELETE)
CREATE POLICY "Encargados can insert servicios" ON servicios
  FOR INSERT
  WITH CHECK (
    lavanderia_id IN (
      SELECT r.lavanderia_id 
      FROM roles_app r
      WHERE r.usuario_id = auth.uid()
        AND r.rol IN ('encargado', 'superadmin')
        AND r.activo = true
    )
  );

CREATE POLICY "Encargados can update servicios" ON servicios
  FOR UPDATE
  USING (
    lavanderia_id IN (
      SELECT r.lavanderia_id 
      FROM roles_app r
      WHERE r.usuario_id = auth.uid()
        AND r.rol IN ('encargado', 'superadmin')
        AND r.activo = true
    )
  )
  WITH CHECK (
    lavanderia_id IN (
      SELECT r.lavanderia_id 
      FROM roles_app r
      WHERE r.usuario_id = auth.uid()
        AND r.rol IN ('encargado', 'superadmin')
        AND r.activo = true
    )
  );

CREATE POLICY "Encargados can delete servicios" ON servicios
  FOR DELETE
  USING (
    lavanderia_id IN (
      SELECT r.lavanderia_id 
      FROM roles_app r
      WHERE r.usuario_id = auth.uid()
        AND r.rol IN ('encargado', 'superadmin')
        AND r.activo = true
    )
  );

-- 3. Verificar políticas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'servicios'
ORDER BY policyname;
