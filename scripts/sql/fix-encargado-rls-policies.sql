-- ============================================================================
-- Script: Políticas RLS para el Rol de Encargado
-- ============================================================================
-- Este script configura todas las políticas de seguridad necesarias para que
-- el rol de encargado pueda realizar todas sus operaciones correctamente.
--
-- Funcionalidades del Encargado:
-- - Leer pedidos de su lavandería
-- - Crear pedidos (mostrador)
-- - Cambiar estado de pedidos
-- - Leer/escribir pedido_items
-- - Leer/editar servicios de su lavandería
-- - Leer tickets (solo lectura)
-- - Validar tickets (cambiar estado validado)
--
-- Ejecución: Copiar y pegar en SQL Editor de Supabase Dashboard
-- ============================================================================

-- ============================================================================
-- 1. TABLA: pedidos
-- ============================================================================

-- NOTA: Las políticas ya existentes (pedidos_insert_cliente, pedidos_select_policy, 
-- pedidos_update_cliente, pedidos_update_staff) ya cubren las operaciones del encargado.
-- Estas políticas permiten:
-- - INSERT: Encargados pueden crear pedidos (por staff policy implícita)
-- - SELECT: Encargados ven pedidos de su lavandería (pedidos_select_policy)
-- - UPDATE: Encargados pueden actualizar pedidos (pedidos_update_staff)
--
-- Sin embargo, la política de INSERT solo permite a clientes. Necesitamos agregar una para encargados.

-- Eliminar y recrear política de INSERT para incluir encargados
DROP POLICY IF EXISTS "pedidos_insert_cliente" ON pedidos;
DROP POLICY IF EXISTS "pedidos_insert_encargado" ON pedidos;

-- INSERT: Clientes pueden crear sus propios pedidos
CREATE POLICY "pedidos_insert_cliente" ON pedidos
  FOR INSERT
  WITH CHECK (cliente_usuario = auth.uid());

-- INSERT: Encargados pueden crear pedidos en su lavandería
CREATE POLICY "pedidos_insert_encargado" ON pedidos
  FOR INSERT
  WITH CHECK (
    lavanderia_id IN (
      SELECT r.lavanderia_id 
      FROM roles_app r
      WHERE r.usuario_id = auth.uid()
        AND r.rol = 'encargado'
        AND r.activo = true
        AND r.lavanderia_id IS NOT NULL
    )
  );

-- ============================================================================
-- 2. TABLA: pedido_items
-- ============================================================================

-- NOTA: Las políticas existentes (pitems_insert_cliente, pitems_select) ya permiten
-- a los encargados trabajar con pedido_items a través de la validación de pedidos.
-- Sin embargo, necesitamos agregar políticas específicas para UPDATE y DELETE.

-- Eliminar políticas antiguas si existen
DROP POLICY IF EXISTS "pitems_insert_encargado" ON pedido_items;
DROP POLICY IF EXISTS "pitems_update_encargado" ON pedido_items;
DROP POLICY IF EXISTS "pitems_delete_encargado" ON pedido_items;

-- INSERT: Encargados pueden crear items para pedidos de su lavandería
CREATE POLICY "pitems_insert_encargado" ON pedido_items
  FOR INSERT
  WITH CHECK (
    pedido_id IN (
      SELECT p.id 
      FROM pedidos p
      JOIN roles_app r ON p.lavanderia_id = r.lavanderia_id
      WHERE r.usuario_id = auth.uid()
        AND r.rol = 'encargado'
        AND r.activo = true
    )
  );

-- UPDATE: Encargados pueden actualizar items de pedidos de su lavandería
CREATE POLICY "pitems_update_encargado" ON pedido_items
  FOR UPDATE
  USING (
    pedido_id IN (
      SELECT p.id 
      FROM pedidos p
      JOIN roles_app r ON p.lavanderia_id = r.lavanderia_id
      WHERE r.usuario_id = auth.uid()
        AND r.rol = 'encargado'
        AND r.activo = true
    )
  )
  WITH CHECK (
    pedido_id IN (
      SELECT p.id 
      FROM pedidos p
      JOIN roles_app r ON p.lavanderia_id = r.lavanderia_id
      WHERE r.usuario_id = auth.uid()
        AND r.rol = 'encargado'
        AND r.activo = true
    )
  );

-- DELETE: Encargados pueden eliminar items de pedidos de su lavandería
CREATE POLICY "pitems_delete_encargado" ON pedido_items
  FOR DELETE
  USING (
    pedido_id IN (
      SELECT p.id 
      FROM pedidos p
      JOIN roles_app r ON p.lavanderia_id = r.lavanderia_id
      WHERE r.usuario_id = auth.uid()
        AND r.rol = 'encargado'
        AND r.activo = true
    )
  );

-- ============================================================================
-- 3. TABLA: servicios
-- ============================================================================

-- NOTA: Las políticas existentes en servicios ya permiten a encargados gestionar servicios:
-- - "Anyone can view active servicios": permite ver servicios activos
-- - "Encargados can insert servicios": permite crear servicios
-- - "Encargados can update servicios": permite actualizar servicios
-- - "Encargados can delete servicios": permite eliminar servicios
--
-- Sin embargo, necesitamos agregar una política para que encargados vean TODOS los servicios
-- (incluso inactivos) de su lavandería.

-- Eliminar y recrear política de SELECT para servicios
DROP POLICY IF EXISTS "Encargados can view all servicios from lavanderia" ON servicios;

-- READ: Encargados pueden ver TODOS los servicios (incluso inactivos) de su lavandería
CREATE POLICY "Encargados can view all servicios from lavanderia" ON servicios
  FOR SELECT
  USING (
    lavanderia_id IN (
      SELECT r.lavanderia_id 
      FROM roles_app r
      WHERE r.usuario_id = auth.uid()
        AND r.rol IN ('encargado', 'superadmin')
        AND r.activo = true
        AND r.lavanderia_id IS NOT NULL
    )
  );

-- ============================================================================
-- 4. TABLA: tickets
-- ============================================================================

-- NOTA: Las políticas existentes en tickets:
-- - "tickets_insert_cliente": permite a clientes crear tickets
-- - "tickets_select": permite ver tickets a clientes y staff
--
-- Necesitamos agregar políticas para que encargados puedan:
-- - Crear tickets cuando crean pedidos
-- - Actualizar tickets para validación

-- Eliminar políticas antiguas si existen
DROP POLICY IF EXISTS "tickets_insert_encargado" ON tickets;
DROP POLICY IF EXISTS "tickets_update_encargado" ON tickets;

-- INSERT: Encargados pueden crear tickets para pedidos de su lavandería
CREATE POLICY "tickets_insert_encargado" ON tickets
  FOR INSERT
  WITH CHECK (
    lavanderia_id IN (
      SELECT r.lavanderia_id 
      FROM roles_app r
      WHERE r.usuario_id = auth.uid()
        AND r.rol = 'encargado'
        AND r.activo = true
        AND r.lavanderia_id IS NOT NULL
    )
  );

-- UPDATE: Encargados pueden validar tickets (actualizar intentos, validado, etc.)
CREATE POLICY "tickets_update_encargado" ON tickets
  FOR UPDATE
  USING (
    lavanderia_id IN (
      SELECT r.lavanderia_id 
      FROM roles_app r
      WHERE r.usuario_id = auth.uid()
        AND r.rol IN ('encargado', 'repartidor')
        AND r.activo = true
        AND r.lavanderia_id IS NOT NULL
    )
  )
  WITH CHECK (
    lavanderia_id IN (
      SELECT r.lavanderia_id 
      FROM roles_app r
      WHERE r.usuario_id = auth.uid()
        AND r.rol IN ('encargado', 'repartidor')
        AND r.activo = true
        AND r.lavanderia_id IS NOT NULL
    )
  );

-- ============================================================================
-- 5. TABLA: eventos (Opcional - para futuro sistema de eventos)
-- ============================================================================

-- Si tienes una tabla de eventos, descomenta y adapta esto:

-- DROP POLICY IF EXISTS "Encargados can insert eventos" ON eventos;

-- CREATE POLICY "Encargados can insert eventos" ON eventos
--   FOR INSERT
--   WITH CHECK (
--     lavanderia_id IN (
--       SELECT r.lavanderia_id 
--       FROM roles_app r
--       JOIN perfiles_app p ON r.perfil_id = p.id
--       WHERE p.auth_user_id = auth.uid()
--         AND r.rol = 'encargado'
--         AND r.activo = true
--         AND r.lavanderia_id IS NOT NULL
--     )
--   );

-- ============================================================================
-- VERIFICACIÓN: Ver todas las políticas creadas
-- ============================================================================

-- Ejecuta estas queries para verificar que las políticas se crearon correctamente:

-- Políticas de pedidos
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'pedidos'
ORDER BY policyname;

-- Políticas de pedido_items
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'pedido_items'
ORDER BY policyname;

-- Políticas de servicios
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'servicios'
ORDER BY policyname;

-- Políticas de tickets
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'tickets'
ORDER BY policyname;

-- ============================================================================
-- NOTAS IMPORTANTES
-- ============================================================================

/*
1. ESTRUCTURA DE LA BASE DE DATOS:
   - perfiles_app: usuario_id (PK) → auth.uid()
   - roles_app: usuario_id → perfiles_app.usuario_id
   - Las políticas validan directamente con roles_app.usuario_id = auth.uid()

2. POLÍTICAS EXISTENTES:
   - La mayoría de las políticas ya están configuradas correctamente
   - Este script agrega las políticas faltantes para encargados:
     * pedidos_insert_encargado: permite crear pedidos
     * pitems_insert/update/delete_encargado: gestión de items
     * tickets_insert/update_encargado: gestión de tickets
     * Encargados can view all servicios from lavanderia: ver servicios inactivos

3. REALTIME:
   - Las políticas RLS se aplican automáticamente a Realtime
   - El encargado recibirá actualizaciones solo de pedidos de su lavandería
   - Para habilitar Realtime, ir a Database > Replication y activar las tablas:
     * pedidos
     * pedido_items
     * tickets

4. TESTING:
   - Después de aplicar estas políticas, prueba crear un pedido desde la app
   - Si hay errores, revisa los logs en Supabase Dashboard > Logs
   - Verifica que el usuario tenga un rol activo de encargado con lavanderia_id

5. SEGURIDAD:
   - Estas políticas aseguran que un encargado SOLO puede:
     * Ver/modificar datos de SU lavandería
     * NO puede acceder a datos de otras lavanderías
   - La validación se hace a nivel de base de datos (no solo en el cliente)

6. TROUBLESHOOTING:
   - Si obtienes error "new row violates row-level security policy":
     a) Verifica que el usuario esté autenticado (auth.uid() no es null)
     b) Verifica que tenga un rol de encargado activo
     c) Verifica que el rol tenga lavanderia_id asignado
   
   - Para debugging, ejecuta en SQL Editor:
     SELECT 
       r.id,
       r.usuario_id,
       r.rol,
       r.lavanderia_id,
       r.activo,
       auth.uid() as current_user
     FROM roles_app r
     WHERE r.usuario_id = auth.uid();

7. OPERACIONES SOPORTADAS:
   
   PEDIDOS:
   ✓ SELECT - Ver pedidos de su lavandería (pedidos_select_policy)
   ✓ INSERT - Crear pedidos en su lavandería (pedidos_insert_encargado)
   ✓ UPDATE - Cambiar estado de pedidos (pedidos_update_staff)
   
   PEDIDO_ITEMS:
   ✓ SELECT - Ver items de pedidos (pitems_select)
   ✓ INSERT - Agregar items a pedidos (pitems_insert_encargado)
   ✓ UPDATE - Modificar items (pitems_update_encargado)
   ✓ DELETE - Eliminar items (pitems_delete_encargado)
   
   SERVICIOS:
   ✓ SELECT - Ver todos los servicios, incluso inactivos (nueva política)
   ✓ INSERT - Crear servicios (Encargados can insert servicios)
   ✓ UPDATE - Actualizar precios, activar/desactivar (Encargados can update servicios)
   ✓ DELETE - Eliminar servicios (Encargados can delete servicios)
   
   TICKETS:
   ✓ SELECT - Ver tickets de pedidos (tickets_select)
   ✓ INSERT - Crear tickets al crear pedidos (tickets_insert_encargado)
   ✓ UPDATE - Validar tickets con PIN (tickets_update_encargado)

8. MANTENIMIENTO:
   - Si agregas nuevas tablas relacionadas, recuerda crear políticas similares
   - Mantén la consistencia: siempre verificar rol='encargado' AND activo=true
   - Usa el patrón: r.usuario_id = auth.uid() (no auth_user_id ni perfil_id)
*/

-- ============================================================================
-- FIN DEL SCRIPT
-- ============================================================================
