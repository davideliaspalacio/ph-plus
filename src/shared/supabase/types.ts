/**
 * Tipos del esquema de Supabase.
 *
 * Por ahora exportamos un tipo `Database` mínimo derivado a mano de los
 * schemas de domain/* para que el código compile sin tener un proyecto
 * Supabase real corriendo. Cuando ejecutemos por primera vez:
 *
 *     supabase gen types typescript --project-id <id> --schema public \
 *       > src/shared/supabase/types.ts
 *
 * el archivo se sobreescribe con la versión generada que incluye:
 *   - Tables: row / insert / update / relationships
 *   - Views, functions, enums
 *
 * Mientras tanto, este tipo "esqueleto" sirve para que los repos no usen
 * `any` durante el desarrollo. Cualquier campo que falte se autocompleta
 * tras regenerar.
 */

import type {
  Order,
  OrderStatus,
  OrderPaymentMethod,
  OrderTotals,
  OrderContact,
  OrderShipping,
  OrderPayment,
} from "@/src/features/orders";
import type { Product } from "@/app/lib/products";
import type { Address } from "@/src/features/account";
import type { Coupon } from "@/src/features/coupons";
import type { ShippingZone } from "@/src/features/shipping";
import type { Review } from "@/src/features/reviews";
import type {
  StockItem,
  StockMovement,
} from "@/src/features/admin/inventory";
import type { Content } from "@/src/features/admin/content";
import type {
  EmailMessage,
} from "@/src/features/notifications";

export type Role = "customer" | "read_only" | "staff" | "super_admin";

export interface ProfileRow {
  id: string;
  email: string;
  name: string;
  role: Role;
  is_vip: boolean;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: Partial<ProfileRow> & { id: string; email: string };
        Update: Partial<ProfileRow>;
      };
      addresses: {
        Row: Address;
        Insert: Omit<Address, "id" | "createdAt" | "updatedAt"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Address>;
      };
      products: {
        Row: Product;
        Insert: Partial<Product> & { slug: string; title: string };
        Update: Partial<Product>;
      };
      coupons: {
        Row: Coupon;
        Insert: Partial<Coupon> & { code: string; type: Coupon["type"] };
        Update: Partial<Coupon>;
      };
      shipping_zones: {
        Row: ShippingZone;
        Insert: Partial<ShippingZone> & { name: string };
        Update: Partial<ShippingZone>;
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          status: OrderStatus;
          contact: OrderContact;
          shipping: OrderShipping;
          payment: OrderPayment;
          totals: OrderTotals;
          coupon_code: string | null;
          tracking_number: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["orders"]["Row"]> & {
          id: string;
          contact: OrderContact;
          shipping: OrderShipping;
          payment: OrderPayment;
          totals: OrderTotals;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Row"]>;
      };
      order_lines: {
        Row: {
          id: string;
          order_id: string;
          slug: string;
          title: string;
          quantity: number;
          unit_price: number;
          line_total: number;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["order_lines"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["order_lines"]["Row"]
        >;
      };
      order_notes: {
        Row: {
          id: string;
          order_id: string;
          author: string;
          text: string;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["order_notes"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["order_notes"]["Row"]
        >;
      };
      reviews: {
        Row: Review;
        Insert: Partial<Review> & {
          product_slug: string;
          rating: number;
          title: string;
          text: string;
          author_name: string;
        };
        Update: Partial<Review>;
      };
      stock_items: {
        Row: StockItem;
        Insert: StockItem;
        Update: Partial<StockItem>;
      };
      stock_movements: {
        Row: StockMovement;
        Insert: Omit<StockMovement, "id" | "createdAt">;
        Update: Partial<StockMovement>;
      };
      content: {
        Row: { id: string } & Content;
        Insert: Partial<Content> & { id: string };
        Update: Partial<Content>;
      };
      settings: {
        Row: {
          id: string;
          business_name: string;
          nit: string;
          phone: string;
          whatsapp: string;
          address: string | null;
          tax_rate: number;
          payment_methods: string[];
          policies: { shipping: string; returns: string };
          updated_at: string;
        };
        Insert: Partial<
          Database["public"]["Tables"]["settings"]["Row"]
        > & { id: string };
        Update: Partial<Database["public"]["Tables"]["settings"]["Row"]>;
      };
      newsletter_subscribers: {
        Row: {
          email: string;
          name: string | null;
          source: string;
          hubspot_synced: boolean;
          hubspot_contact_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<
          Database["public"]["Tables"]["newsletter_subscribers"]["Row"]
        > & { email: string };
        Update: Partial<
          Database["public"]["Tables"]["newsletter_subscribers"]["Row"]
        >;
      };
      notifications_outbox: {
        Row: EmailMessage;
        Insert: Partial<EmailMessage> & {
          to: string;
          subject: string;
          html: string;
        };
        Update: Partial<EmailMessage>;
      };
      keep_alive: {
        Row: { id: string; pinged_at: string };
        Insert: { id?: string; pinged_at?: string };
        Update: { id?: string; pinged_at?: string };
      };
    };
    Functions: {
      apply_stock_movement: {
        Args: {
          p_sku: string;
          p_type: "in" | "out" | "adjustment" | "return";
          p_quantity: number;
          p_reason: "purchase" | "sale" | "loss" | "return" | "manual";
          p_author: string;
          p_note?: string;
        };
        Returns: StockItem;
      };
      new_order_id: {
        Args: Record<string, never>;
        Returns: string;
      };
      is_valid_order_transition: {
        Args: { from_status: OrderStatus; to_status: OrderStatus };
        Returns: boolean;
      };
      current_role: {
        Args: Record<string, never>;
        Returns: Role;
      };
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      user_role: Role;
      order_status: OrderStatus;
      payment_method: OrderPaymentMethod;
      product_category: "botellon" | "garrafa" | "recarga" | "kit" | "promocion";
      product_size: "1L" | "1.5L" | "5L" | "19L" | "kit";
      product_visual_key: "kit" | "garrafas" | "recargas";
      coupon_type: "percent" | "fixed" | "free_shipping";
      review_status: "pending" | "approved" | "rejected";
      stock_movement_type: "in" | "out" | "adjustment" | "return";
      stock_movement_reason: "purchase" | "sale" | "loss" | "return" | "manual";
      email_template:
        | "order_confirmation"
        | "order_shipped"
        | "password_recover"
        | "welcome"
        | "review_approved"
        | "low_stock_alert"
        | "custom";
      email_status: "queued" | "sent" | "failed";
    };
  };
}
