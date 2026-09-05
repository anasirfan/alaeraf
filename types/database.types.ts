/**
 * Hand-authored Supabase database types for the Al Aeraf schema.
 *
 * This mirrors the SQL in supabase/migrations/*.sql. Once the Supabase
 * project exists and the migrations have been applied, regenerate this file
 * from the live database instead of hand-editing it further:
 *
 *   npx supabase gen types typescript --project-id <project-ref> > types/database.types.ts
 *
 * Until then, this file is the single source of truth the app compiles
 * against, so any change to the SQL schema should be mirrored here too.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "customer" | "admin";
export type ProductType = "hair_oil" | "ro_water";
export type StockStatus = "in_stock" | "out_of_stock" | "preorder";
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";
export type PaymentMethod = "cod" | "manual";
export type PaymentStatus = "unpaid" | "paid" | "refunded";
export type SubscriptionStatus = "active" | "paused" | "cancelled";
export type SubscriptionFrequency = "weekly" | "fortnightly" | "monthly";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          full_name: string | null;
          phone: string | null;
          email: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: UserRole;
          full_name?: string | null;
          phone?: string | null;
          email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: UserRole;
          full_name?: string | null;
          phone?: string | null;
          email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
        Relationships: [];
      };

      products: {
        Row: {
          id: string;
          category_id: string;
          name: string;
          slug: string;
          description: string | null;
          short_description: string | null;
          price: number;
          compare_at_price: number | null;
          product_type: ProductType;
          size_label: string | null;
          stock_status: StockStatus;
          is_active: boolean;
          is_featured: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          name: string;
          slug: string;
          description?: string | null;
          short_description?: string | null;
          price: number;
          compare_at_price?: number | null;
          product_type: ProductType;
          size_label?: string | null;
          stock_status?: StockStatus;
          is_active?: boolean;
          is_featured?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };

      product_images: {
        Row: {
          id: string;
          product_id: string;
          storage_path: string;
          alt_text: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          storage_path: string;
          alt_text?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["product_images"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };

      ro_plants: {
        Row: {
          id: string;
          name: string;
          address: string | null;
          latitude: number;
          longitude: number;
          delivery_radius_km: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          address?: string | null;
          latitude: number;
          longitude: number;
          delivery_radius_km?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["ro_plants"]["Insert"]>;
        Relationships: [];
      };

      addresses: {
        Row: {
          id: string;
          customer_id: string;
          recipient_name: string;
          phone: string;
          address_line: string;
          area: string | null;
          latitude: number | null;
          longitude: number | null;
          delivery_notes: string | null;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          recipient_name: string;
          phone: string;
          address_line: string;
          area?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          delivery_notes?: string | null;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["addresses"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "addresses_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };

      orders: {
        Row: {
          id: string;
          order_number: string;
          customer_id: string;
          address_id: string;
          status: OrderStatus;
          subtotal: number;
          delivery_fee: number;
          total: number;
          payment_method: PaymentMethod;
          payment_status: PaymentStatus;
          notes: string | null;
          assigned_ro_plant_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number?: string;
          customer_id: string;
          address_id: string;
          status?: OrderStatus;
          subtotal?: number;
          delivery_fee?: number;
          total?: number;
          payment_method?: PaymentMethod;
          payment_status?: PaymentStatus;
          notes?: string | null;
          assigned_ro_plant_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "orders_address_id_fkey";
            columns: ["address_id"];
            isOneToOne: false;
            referencedRelation: "addresses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "orders_assigned_ro_plant_id_fkey";
            columns: ["assigned_ro_plant_id"];
            isOneToOne: false;
            referencedRelation: "ro_plants";
            referencedColumns: ["id"];
          },
        ];
      };

      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          product_name: string;
          unit_price: number;
          quantity: number;
          subtotal: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          product_name: string;
          unit_price: number;
          quantity: number;
          subtotal?: number;
        };
        Update: Partial<Database["public"]["Tables"]["order_items"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };

      subscription_plans: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          default_frequency: SubscriptionFrequency;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          default_frequency?: SubscriptionFrequency;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["subscription_plans"]["Insert"]>;
        Relationships: [];
      };

      subscriptions: {
        Row: {
          id: string;
          customer_id: string;
          address_id: string;
          plan_id: string;
          frequency: SubscriptionFrequency;
          status: SubscriptionStatus;
          quantity: number;
          next_delivery_date: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          address_id: string;
          plan_id: string;
          frequency: SubscriptionFrequency;
          status?: SubscriptionStatus;
          quantity?: number;
          next_delivery_date?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["subscriptions"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "subscriptions_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "subscriptions_address_id_fkey";
            columns: ["address_id"];
            isOneToOne: false;
            referencedRelation: "addresses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "subscriptions_plan_id_fkey";
            columns: ["plan_id"];
            isOneToOne: false;
            referencedRelation: "subscription_plans";
            referencedColumns: ["id"];
          },
        ];
      };

      subscription_items: {
        Row: {
          id: string;
          subscription_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
        };
        Insert: {
          id?: string;
          subscription_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
        };
        Update: Partial<Database["public"]["Tables"]["subscription_items"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "subscription_items_subscription_id_fkey";
            columns: ["subscription_id"];
            isOneToOne: false;
            referencedRelation: "subscriptions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "subscription_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
    };

    Views: Record<string, never>;

    Functions: {
      is_delivery_available: {
        Args: { lat: number; lng: number };
        Returns: boolean;
      };
      nearest_eligible_ro_plant: {
        Args: { lat: number; lng: number };
        Returns: {
          plant_id: string;
          plant_name: string;
          distance_m: number;
        }[];
      };
      create_order: {
        Args: {
          p_address_id: string;
          p_items: Json;
          p_notes: string | null;
        };
        Returns: {
          order_id: string;
          order_number: string;
        }[];
      };
      create_subscription: {
        Args: {
          p_plan_id: string;
          p_address_id: string;
          p_items: Json;
          p_notes: string | null;
        };
        Returns: { subscription_id: string }[];
      };
      update_subscription_status: {
        Args: {
          p_subscription_id: string;
          p_status: SubscriptionStatus;
        };
        Returns: undefined;
      };
      create_subscription_delivery_order: {
        Args: { p_subscription_id: string };
        Returns: {
          order_id: string;
          order_number: string;
        }[];
      };
    };

    Enums: {
      user_role: UserRole;
      product_type: ProductType;
      stock_status: StockStatus;
      order_status: OrderStatus;
      payment_method: PaymentMethod;
      payment_status: PaymentStatus;
      subscription_status: SubscriptionStatus;
      subscription_frequency: SubscriptionFrequency;
    };
  };
};
