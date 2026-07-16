-- ─────────────────────────────────────────────────────────────────────────────
-- Cierra una fuga de PII en los pedidos de invitado.
--
-- `orders_owner_or_guest_select` permitía leer CUALQUIER fila con
-- `user_id is null` — es decir, todos los pedidos de invitado — a cualquiera,
-- incluido `anon`. El comentario original asumía que "el caller filtra por id",
-- pero RLS no puede confiar en eso: `SupabaseOrderRepo.list()` no filtra, y la
-- anon key es pública (viaja en el bundle del browser). Resultado: cualquiera
-- podía listar nombre, email, teléfono y dirección de todos los compradores
-- invitados — que en esta tienda son la mayoría.
--
-- Nadie necesitaba ese permiso:
--   * /checkout/exito lee el pedido de sessionStorage, no de la DB.
--   * /cuenta/pedidos usa byUser() → user_id = auth.uid().
--   * El admin lee vía is_staff_or_ro().
--   * Las rutas de servidor escriben con la service_role, que bypassea RLS.
-- ─────────────────────────────────────────────────────────────────────────────

drop policy if exists "orders_owner_or_guest_select" on public.orders;
drop policy if exists "orders_owner_or_staff_select" on public.orders;

create policy "orders_owner_or_staff_select" on public.orders
  for select using (
    user_id = auth.uid()          -- su propio pedido
    or public.is_staff_or_ro()    -- back office
  );

-- Las líneas cuelgan del pedido padre: mismo criterio.
drop policy if exists "order_lines_select_via_order" on public.order_lines;

create policy "order_lines_select_via_order" on public.order_lines
  for select using (
    exists (
      select 1 from public.orders o
       where o.id = order_lines.order_id
         and (o.user_id = auth.uid() or public.is_staff_or_ro())
    )
  );
