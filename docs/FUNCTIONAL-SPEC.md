# Especificación Funcional — PH PLUS Ecommerce

> Una página por feature. Cada feature lista: **Propósito · Actores · Pantallas · Flujos · Reglas · Estados · Eventos · Tests críticos**.

---

## Índice

**Storefront (usuario)**
1. [Home](#1-home)
2. [Catálogo](#2-catálogo)
3. [Búsqueda](#3-búsqueda)
4. [Producto (PDP)](#4-producto-pdp)
5. [Carrito](#5-carrito)
6. [Checkout](#6-checkout)
7. [Orden creada](#7-orden-creada)
8. [Auth (login / signup / recuperar)](#8-auth)
9. [Cuenta](#9-cuenta)
10. [Pedidos del usuario](#10-pedidos-del-usuario)
11. [Wishlist](#11-wishlist)
12. [Reviews escribibles](#12-reviews)
13. [Envíos públicos](#13-envíos)
14. [Notificaciones](#14-notificaciones)

**Admin**
15. [Login admin](#15-login-admin)
16. [Dashboard](#16-dashboard)
17. [Productos](#17-productos-admin)
18. [Pedidos](#18-pedidos-admin)
19. [Inventario](#19-inventario)
20. [Clientes](#20-clientes)
21. [Cupones](#21-cupones)
22. [Zonas de envío](#22-zonas-de-envío)
23. [Moderación de reviews](#23-moderación-de-reviews)
24. [Contenido](#24-contenido)
25. [Ajustes](#25-ajustes)

---

## STOREFRONT

### 1. Home

- **Propósito**: comunicar valor de PH PLUS, llevar a catálogo y a productos top.
- **Pantallas**: `/`
- **Bloques**:
  1. Header sticky con search, cart icon, login.
  2. Hero (CTA "Comprar ahora", visual de producto).
  3. Productos destacados (carrusel mobile, grid 3 col desktop).
  4. Why PH PLUS (3 bullets con íconos).
  5. Testimonial (1 con foto + estrellas; carrusel opcional).
  6. CTA final (suscripción / pedido recurrente).
  7. Footer.
- **Reglas**: destacados se editan desde admin (feature `content`).
- **Tests**: render de cada bloque, CTA navega a `/productos`, cart icon abre drawer.

### 2. Catálogo

- **Propósito**: explorar y filtrar el catálogo.
- **Pantalla**: `/productos`
- **Layout**:
  - Desktop: sidebar izq con filtros, grid 3 col.
  - Mobile: botón "Filtros" abajo (sticky) → bottom-sheet.
- **Filtros**: categoría (chips), tamaño (chips), promo (toggle), precio (range), disponibilidad (toggle "sólo disponibles"), rating (estrellas).
- **Sort**: popularidad, precio asc, precio desc, novedades.
- **URL params** sincronizados (`?cat=botellones&size=large&sort=price-asc`).
- **Paginación**: 12 por página + "ver más".
- **Estados**: loading skeleton (8 cards), empty ("No encontramos productos con esos filtros, limpiar filtros"), error.
- **Tests**: cada filtro recorta el set; combinaciones; URL ↔ store; reset.

### 3. Búsqueda

- **Propósito**: encontrar productos rápido por nombre / categoría.
- **Pantallas**: dropdown desde header + `/buscar?q=`.
- **Comportamiento**:
  - Input en header con debounce 200ms.
  - Dropdown muestra: hasta 6 productos, hasta 3 categorías, "ver todos los resultados".
  - Historial de búsquedas recientes (máx 5) en localStorage.
  - Tolerancia básica a typos (Fuse.js o equivalente).
- **Estados**: vacío ("Escribe al menos 2 caracteres"), sin resultados, resultados.
- **Tests**: debounce, ranking, persistencia historial, navegación con teclado (↑↓ Enter).

### 4. Producto (PDP)

- **Propósito**: convencer y agregar al carrito.
- **Pantalla**: `/productos/[slug]`
- **Bloques**:
  - Gallery (5 imágenes; zoom desktop, swipe mobile).
  - Nombre + rating + reviews count (link a tab Reviews).
  - Precio (con strikethrough si hay `compareAtPrice`).
  - Specs cortas (pH, tamaño, origen).
  - Selector qty.
  - CTA "Añadir al carrito" (sticky bottom en mobile).
  - Tabs: Descripción / Specs / Reviews / Envío y devoluciones.
  - Cross-sell ("frecuentemente comprados juntos").
  - Relacionados.
- **Reglas**:
  - Si `stock === 0` → CTA cambia a "Notifícame cuando llegue" + email input.
  - Si producto inactivo → 404.
- **SEO**: `generateMetadata` con name, description, og:image.
- **Tests**: render, agregar al carrito (con qty), out-of-stock UI, tabs ARIA, gallery con teclado.

### 5. Carrito

- **Propósito**: revisar, ajustar y avanzar a checkout o WhatsApp.
- **Pantallas**: `/carrito` + drawer desde header.
- **Items**: imagen, nombre, qty stepper, precio unit, subtotal línea, eliminar.
- **Resumen**: subtotal, envío estimado (input "tu ciudad"), descuento (cupón), total.
- **Cupón**: input + "Aplicar". Valida con feature `coupons`. Muestra error si inválido / vencido.
- **Upsell**: "Te faltan $X para envío gratis" (barra de progreso).
- **CTAs**: "Continuar al pago", "Pedir por WhatsApp" (formato del mensaje preconfigurado).
- **Estados**: vacío (ilustración + CTA "Ver productos"), 1+ items.
- **Tests**: alta/baja/qty, persistencia entre refresh, aplicación de cupón válido/inválido, cálculo de envío gratis.

### 6. Checkout

- **Propósito**: capturar datos mínimos y confirmar pago.
- **Pantalla**: `/checkout`
- **Layout**:
  - Desktop: 2 col (form + resumen sticky).
  - Mobile: form full width; resumen colapsable arriba; CTA sticky bottom.
- **Secciones**:
  1. Express checkout (Apple Pay / Google Pay / Mercado Pago / PSE) — mock arriba.
  2. Contacto (email + tel).
  3. Envío (nombre, dirección, ciudad, depto, código postal opcional, notas).
  4. Pago (radios: tarjeta, PSE, Nequi, contraentrega).
  5. Resumen + condiciones + CTA "Pagar $X".
- **Reglas**:
  - Guest checkout por defecto. Tras `/checkout/exito` se ofrece crear cuenta.
  - Si el usuario está logueado, prefill desde `account/addresses`.
  - Validación con Zod (formatos, longitudes, dependencia ciudad-departamento).
  - `inputMode` y `type` correctos por campo.
  - Errores debajo del campo en blur.
  - Trust signals (candado, política) al lado del CTA.
- **Tests**: validación cada campo, prefill, total recalcula con cupón/envío, CTA disabled hasta válido, E2E happy path.

### 7. Orden creada

- **Pantalla**: `/checkout/exito?id=ORD-XXXX`
- **Bloques**: mensaje éxito, número de pedido, recap (contacto, envío, items, totales), CTA "WhatsApp soporte" y "Volver a comprar".
- **Reglas**: si no hay `lastOrder` en session → redirect a `/`.
- **Prompt crear cuenta**: si el usuario no estaba logueado, modal "Crea tu cuenta con un click" con email prellenado.
- **Tests**: render de un pedido válido, redirect si sin pedido, creación de cuenta post-compra.

### 8. Auth

- **Pantallas**: `/login`, `/registro`, `/recuperar`.
- **Login**: email + password. Botón "Continuar como invitado". Links a registro y recuperar.
- **Registro**: email + password (mín 8, 1 número), nombre, acepta TyC.
- **Recuperar**: email → mensaje "Te enviamos un correo" (mock — visible en admin → Outbox).
- **Mock**: hash con `crypto.subtle`, almacenado en `phplus.db.users.v1`. Sesión en `phplus.session`.
- **Tests**: validación, login OK / KO, registro OK / duplicado, persistencia.

### 9. Cuenta

- **Pantalla raíz**: `/cuenta` (dashboard del usuario).
- **Subrutas**: `/cuenta/perfil`, `/cuenta/direcciones`, `/cuenta/metodos-pago`, `/cuenta/pedidos`, `/cuenta/favoritos`, `/cuenta/notificaciones`.
- **Perfil**: nombre, email, tel, password change.
- **Direcciones**: CRUD; flag "predeterminada".
- **Métodos de pago**: mock (últimos 4 + venc).
- **Notificaciones**: preferencias (email, WhatsApp).
- **Tests**: CRUD direcciones, cambio password, guard de ruta.

### 10. Pedidos del usuario

- **Pantalla**: `/cuenta/pedidos` (lista) y `/cuenta/pedidos/[id]` (detalle).
- **Lista**: tarjetas con #pedido, fecha, total, estado, miniatura items.
- **Detalle**: timeline (pendiente → pagado → preparando → enviado → entregado → cerrado), items, totales, dirección, tracking number si existe, botones (Volver a comprar, Solicitar devolución, Cancelar si aplica).
- **Tests**: render por estado, "comprar de nuevo" agrega al carrito.

### 11. Wishlist

- **Pantalla**: `/cuenta/favoritos` y botón corazón en PDP/cards.
- **Persistencia**: `localStorage` (cuando no hay sesión) → al loguearse, merge con server (mock).
- **Tests**: toggle, persistencia, badge count en header.

### 12. Reviews

- **Lectura**: en PDP, paginadas, con resumen (promedio + distribución estrellas).
- **Escritura**: usuario logueado que **compró el producto** puede escribir review. Form: rating 1–5 + título + texto + foto opcional + checkbox "recomiendo".
- **Estado**: `pending` por default → moderado por admin.
- **Tests**: gate "ya compró", form, estado pending visible al autor.

### 13. Envíos

- **Pantalla**: `/envios`. Lo que hay hoy + cálculo dinámico (input "tu ciudad" → costo + tiempo).
- **Datos**: zonas vienen de `features/shipping`. Admin las edita.
- **Tests**: cálculo por zona, fallback "consultar".

### 14. Notificaciones

- **Comportamiento**: toasts globales (success/info/error/warning), cola de 3 visibles, auto-dismiss 4s, hover pausa.
- **Lugar**: top-right desktop, top center mobile.
- **API**: `notify.success("...")`, `notify.error("...")`.
- **Tests**: cola, dismiss, accesibilidad (`aria-live`).

---

## ADMIN

### 15. Login admin

- **Pantalla**: `/admin/login`.
- **Reglas**: el usuario debe tener `role in [super_admin, staff, read_only]`. Si no, error "no autorizado".
- **Sesión**: separada de la de cliente (mismo store, distinto namespace).
- **Tests**: gate, redirect post-login al dashboard, logout limpia sesión.

### 16. Dashboard

- **Pantalla**: `/admin`.
- **KPIs (cards)**: ventas hoy, ventas 7d, ventas 30d, pedidos pendientes, productos low-stock, abandono carrito (mock).
- **Gráficas**: ventas por día (line, 30d), pedidos por estado (donut), top 5 productos (bar).
- **Tablas**: últimos 10 pedidos, últimas 5 reviews pendientes.
- **Filtros**: date range picker global.
- **Tests**: cálculos a partir del mock dataset, render por rol (read_only no ve "reembolsar" en pedidos linkeados).

### 17. Productos (admin)

- **Lista**: `/admin/productos`
  - DataTable con columnas: imagen, nombre, SKU, categoría, precio, stock, estado, acciones.
  - Filtros: categoría, estado, stock (low / out), search.
  - Bulk actions: publicar, despublicar, archivar, duplicar, exportar CSV.
- **Crear / editar**: `/admin/productos/nuevo` y `/admin/productos/[id]`
  - Tabs: General (nombre, slug, descripción, visualKey), Precio (precio, compareAt, costo), Imágenes (uploader, reorder), Stock (cantidad, SKU, código de barras), SEO (title, description, og:image), Visibilidad (activo, fechas).
  - Validación Zod en cada tab.
- **Reglas**:
  - Slug autogenerado del nombre, editable.
  - Borrar = archivar (soft delete).
  - `read_only` ve pero no edita.
- **Tests**: CRUD, slug uniqueness, validación, bulk publicar.

### 18. Pedidos (admin)

- **Lista**: `/admin/pedidos`
  - Filtros: estado, fecha, monto, cliente, método de pago.
  - Tabla con #, fecha, cliente, total, estado, pago, acciones.
- **Detalle**: `/admin/pedidos/[id]`
  - Header con # y estado actual.
  - Timeline accionable: marcar pagado → preparando → enviado (pide tracking) → entregado → cerrado. Cancelar / reembolsar en cualquier punto válido.
  - Items, direcciones, totales.
  - Notas internas (timeline de notas con autor + fecha).
  - "Contactar por WhatsApp" abre `wa.me` con plantilla.
- **Reglas**:
  - Transiciones de estado validadas (no se puede "entregar" sin "enviar").
  - Reembolso total o parcial (mock).
  - `staff` puede todo menos eliminar; `super_admin` todo.
- **Tests**: máquina de estados, permisos por rol, notas, exportar.

### 19. Inventario

- **Pantalla**: `/admin/inventario`.
- **Lista por SKU** con stock, ubicación (mock), valor.
- **Ajuste**: entrada / salida con motivo (compra, merma, ajuste, devolución), comentario.
- **Histórico** de movimientos por SKU.
- **Alertas**: SKUs bajo umbral resaltados.
- **Tests**: ajuste actualiza stock del producto, histórico cronológico.

### 20. Clientes

- **Lista**: `/admin/clientes`. Filtros y search.
- **Ficha 360**: `/admin/clientes/[id]`
  - Datos básicos, total gastado, LTV, # pedidos, fecha de alta.
  - Tabs: Pedidos, Direcciones, Notas internas.
- **Acciones**: marcar VIP, bloquear, contactar.
- **Tests**: LTV calc, navegación a sus pedidos.

### 21. Cupones

- **Lista**: `/admin/cupones`. CRUD.
- **Form**: código, tipo (`percent | fixed | free_shipping`), valor, vigencia (desde/hasta), mínimo de compra, máximo de usos totales, máximo por cliente, productos/categorías aplicables (opcional), activo.
- **Reglas**: código único, no editable después de uso; archivar en su lugar.
- **Tests**: validación de aplicación (vencido / cumplido el límite / no cumple mínimo), unicidad.

### 22. Zonas de envío

- **Pantalla**: `/admin/envios`.
- **Lista** de zonas con regiones, costo, tiempo, regla free-shipping.
- **Form**: nombre, regiones (chips), costo, tiempo (días desde/hasta), umbral free (opcional), activo.
- **Tests**: matching de zona por ciudad, override free shipping.

### 23. Moderación de reviews

- **Pantalla**: `/admin/reviews`.
- **Cola** con `pending`, `approved`, `rejected` (tabs).
- **Acciones**: aprobar, rechazar (con motivo), responder públicamente.
- **Tests**: transiciones, respuesta visible en PDP.

### 24. Contenido

- **Pantallas**: `/admin/contenido/home` (destacados, hero), `/admin/contenido/banners`, `/admin/contenido/faq`, `/admin/contenido/paginas` (envíos, devoluciones, política).
- **Tests**: cambio en admin se refleja en home (vía repo de content).

### 25. Ajustes

- **Pantalla**: `/admin/ajustes`.
- **Secciones**: negocio (nombre, NIT, dirección, teléfono, WhatsApp), métodos de pago activos (toggles), impuestos (% IVA), políticas (links), email outbox (lista de emails simulados).
- **Tests**: persistencia, "Email outbox" muestra los disparados desde la app.

---

## Apéndice A — Roles

| Rol | Storefront | Admin (lectura) | Admin (escritura) | Reembolsos | Ajustes globales |
|---|---|---|---|---|---|
| `guest` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `customer` | ✅ + cuenta | ❌ | ❌ | ❌ | ❌ |
| `read_only` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `staff` | ✅ | ✅ | ✅ (excepto borrar / ajustes) | ✅ | ❌ |
| `super_admin` | ✅ | ✅ | ✅ | ✅ | ✅ |

## Apéndice B — Máquina de estados de pedido

```
draft ──► pending_payment ──► paid ──► preparing ──► shipped ──► delivered ──► closed
   │             │              │           │            │            │
   └──cancel─────┴──cancel──────┴──refund───┴──refund────┴──return────┘
```

Transiciones inválidas devuelven error y se testean por feature `orders`.

## Apéndice C — Eventos analytics (mock por ahora)

`view_item_list`, `view_item`, `add_to_cart`, `remove_from_cart`, `begin_checkout`, `add_shipping_info`, `add_payment_info`, `purchase`, `search`, `select_item`, `view_promotion`. Almacenamos los últimos 100 en `localStorage` (`phplus.events.v1`) para inspección en admin.
