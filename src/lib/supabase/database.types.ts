export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '13.0.5';
  };
  public: {
    Tables: {
      entregas: {
        Row: {
          completado: boolean;
          coords: Json | null;
          direccion: string | null;
          id: string;
          lavanderia_id: string;
          notas: string | null;
          pedido_id: string;
          repartidor_role_id: string | null;
          repartidor_uaid: string | null;
          timestamp: string;
          tipo: Database['public']['Enums']['entrega_tipo'];
        };
        Insert: {
          completado?: boolean;
          coords?: Json | null;
          direccion?: string | null;
          id?: string;
          lavanderia_id: string;
          notas?: string | null;
          pedido_id: string;
          repartidor_role_id?: string | null;
          repartidor_uaid?: string | null;
          timestamp?: string;
          tipo: Database['public']['Enums']['entrega_tipo'];
        };
        Update: {
          completado?: boolean;
          coords?: Json | null;
          direccion?: string | null;
          id?: string;
          lavanderia_id?: string;
          notas?: string | null;
          pedido_id?: string;
          repartidor_role_id?: string | null;
          repartidor_uaid?: string | null;
          timestamp?: string;
          tipo?: Database['public']['Enums']['entrega_tipo'];
        };
        Relationships: [
          {
            foreignKeyName: 'entregas_lavanderia_id_fkey';
            columns: ['lavanderia_id'];
            isOneToOne: false;
            referencedRelation: 'lavanderias';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'entregas_pedido_id_fkey';
            columns: ['pedido_id'];
            isOneToOne: false;
            referencedRelation: 'pedidos';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'entregas_repartidor_role_id_fkey';
            columns: ['repartidor_role_id'];
            isOneToOne: false;
            referencedRelation: 'roles_app';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'entregas_repartidor_role_id_fkey';
            columns: ['repartidor_role_id'];
            isOneToOne: false;
            referencedRelation: 'usuarios_app_vw';
            referencedColumns: ['id'];
          },
        ];
      };
      eventos: {
        Row: {
          actor_role_id: string | null;
          actor_uaid: string | null;
          created_at: string;
          id: string;
          lavanderia_id: string;
          payload: Json;
          pedido_id: string | null;
          tipo: string;
        };
        Insert: {
          actor_role_id?: string | null;
          actor_uaid?: string | null;
          created_at?: string;
          id?: string;
          lavanderia_id: string;
          payload?: Json;
          pedido_id?: string | null;
          tipo: string;
        };
        Update: {
          actor_role_id?: string | null;
          actor_uaid?: string | null;
          created_at?: string;
          id?: string;
          lavanderia_id?: string;
          payload?: Json;
          pedido_id?: string | null;
          tipo?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'eventos_actor_role_id_fkey';
            columns: ['actor_role_id'];
            isOneToOne: false;
            referencedRelation: 'roles_app';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'eventos_actor_role_id_fkey';
            columns: ['actor_role_id'];
            isOneToOne: false;
            referencedRelation: 'usuarios_app_vw';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'eventos_lavanderia_id_fkey';
            columns: ['lavanderia_id'];
            isOneToOne: false;
            referencedRelation: 'lavanderias';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'eventos_pedido_id_fkey';
            columns: ['pedido_id'];
            isOneToOne: false;
            referencedRelation: 'pedidos';
            referencedColumns: ['id'];
          },
        ];
      };
      lavanderias: {
        Row: {
          config: Json;
          created_at: string;
          descripcion: string | null;
          id: string;
          lat: number | null;
          lng: number | null;
          nombre: string;
          slug: string | null;
          updated_at: string;
        };
        Insert: {
          config?: Json;
          created_at?: string;
          descripcion?: string | null;
          id?: string;
          lat?: number | null;
          lng?: number | null;
          nombre: string;
          slug?: string | null;
          updated_at?: string;
        };
        Update: {
          config?: Json;
          created_at?: string;
          descripcion?: string | null;
          id?: string;
          lat?: number | null;
          lng?: number | null;
          nombre?: string;
          slug?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      notificaciones: {
        Row: {
          actor_role_id: string | null;
          actor_uaid: string | null;
          created_at: string;
          id: string;
          lavanderia_id: string;
          leido: boolean;
          mensaje: string;
          pedido_id: string | null;
          tipo: Database['public']['Enums']['notificacion_tipo'];
          titulo: string;
          usuario_id: string | null;
        };
        Insert: {
          actor_role_id?: string | null;
          actor_uaid?: string | null;
          created_at?: string;
          id?: string;
          lavanderia_id: string;
          leido?: boolean;
          mensaje: string;
          pedido_id?: string | null;
          tipo: Database['public']['Enums']['notificacion_tipo'];
          titulo: string;
          usuario_id?: string | null;
        };
        Update: {
          actor_role_id?: string | null;
          actor_uaid?: string | null;
          created_at?: string;
          id?: string;
          lavanderia_id?: string;
          leido?: boolean;
          mensaje?: string;
          pedido_id?: string | null;
          tipo?: Database['public']['Enums']['notificacion_tipo'];
          titulo?: string;
          usuario_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'notificaciones_actor_role_id_fkey';
            columns: ['actor_role_id'];
            isOneToOne: false;
            referencedRelation: 'roles_app';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'notificaciones_actor_role_id_fkey';
            columns: ['actor_role_id'];
            isOneToOne: false;
            referencedRelation: 'usuarios_app_vw';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'notificaciones_lavanderia_id_fkey';
            columns: ['lavanderia_id'];
            isOneToOne: false;
            referencedRelation: 'lavanderias';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'notificaciones_pedido_id_fkey';
            columns: ['pedido_id'];
            isOneToOne: false;
            referencedRelation: 'pedidos';
            referencedColumns: ['id'];
          },
        ];
      };
      pedido_estados_hist: {
        Row: {
          actor_uaid: string | null;
          changed_at: string;
          from_estado: Database['public']['Enums']['pedido_estado'] | null;
          id: string;
          notas: string | null;
          pedido_id: string;
          to_estado: Database['public']['Enums']['pedido_estado'];
        };
        Insert: {
          actor_uaid?: string | null;
          changed_at?: string;
          from_estado?: Database['public']['Enums']['pedido_estado'] | null;
          id?: string;
          notas?: string | null;
          pedido_id: string;
          to_estado: Database['public']['Enums']['pedido_estado'];
        };
        Update: {
          actor_uaid?: string | null;
          changed_at?: string;
          from_estado?: Database['public']['Enums']['pedido_estado'] | null;
          id?: string;
          notas?: string | null;
          pedido_id?: string;
          to_estado?: Database['public']['Enums']['pedido_estado'];
        };
        Relationships: [
          {
            foreignKeyName: 'pedido_estados_hist_actor_uaid_fkey';
            columns: ['actor_uaid'];
            isOneToOne: false;
            referencedRelation: 'usuarios_app';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'pedido_estados_hist_actor_uaid_fkey';
            columns: ['actor_uaid'];
            isOneToOne: false;
            referencedRelation: 'v_mis_roles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'pedido_estados_hist_pedido_id_fkey';
            columns: ['pedido_id'];
            isOneToOne: false;
            referencedRelation: 'pedidos';
            referencedColumns: ['id'];
          },
        ];
      };
      pedido_items: {
        Row: {
          cantidad: number;
          id: string;
          notas: string | null;
          pedido_id: string;
          precio_unit: number;
          servicio_id: string;
          subtotal: number;
        };
        Insert: {
          cantidad: number;
          id?: string;
          notas?: string | null;
          pedido_id: string;
          precio_unit: number;
          servicio_id: string;
          subtotal: number;
        };
        Update: {
          cantidad?: number;
          id?: string;
          notas?: string | null;
          pedido_id?: string;
          precio_unit?: number;
          servicio_id?: string;
          subtotal?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'pedido_items_pedido_id_fkey';
            columns: ['pedido_id'];
            isOneToOne: false;
            referencedRelation: 'pedidos';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'pedido_items_servicio_id_fkey';
            columns: ['servicio_id'];
            isOneToOne: false;
            referencedRelation: 'servicios';
            referencedColumns: ['id'];
          },
        ];
      };
      pedidos: {
        Row: {
          cliente_usuario: string | null;
          created_at: string;
          created_by: string | null;
          created_by_role_id: string | null;
          delivered_at: string | null;
          estado: Database['public']['Enums']['pedido_estado'];
          id: string;
          lavanderia_id: string;
          notas: string | null;
          ready_at: string | null;
          total: number;
          updated_at: string;
          updated_by: string | null;
          updated_by_role_id: string | null;
        };
        Insert: {
          cliente_usuario?: string | null;
          created_at?: string;
          created_by?: string | null;
          created_by_role_id?: string | null;
          delivered_at?: string | null;
          estado?: Database['public']['Enums']['pedido_estado'];
          id?: string;
          lavanderia_id: string;
          notas?: string | null;
          ready_at?: string | null;
          total?: number;
          updated_at?: string;
          updated_by?: string | null;
          updated_by_role_id?: string | null;
        };
        Update: {
          cliente_usuario?: string | null;
          created_at?: string;
          created_by?: string | null;
          created_by_role_id?: string | null;
          delivered_at?: string | null;
          estado?: Database['public']['Enums']['pedido_estado'];
          id?: string;
          lavanderia_id?: string;
          notas?: string | null;
          ready_at?: string | null;
          total?: number;
          updated_at?: string;
          updated_by?: string | null;
          updated_by_role_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'pedidos_created_by_role_id_fkey';
            columns: ['created_by_role_id'];
            isOneToOne: false;
            referencedRelation: 'roles_app';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'pedidos_created_by_role_id_fkey';
            columns: ['created_by_role_id'];
            isOneToOne: false;
            referencedRelation: 'usuarios_app_vw';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'pedidos_lavanderia_id_fkey';
            columns: ['lavanderia_id'];
            isOneToOne: false;
            referencedRelation: 'lavanderias';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'pedidos_updated_by_role_id_fkey';
            columns: ['updated_by_role_id'];
            isOneToOne: false;
            referencedRelation: 'roles_app';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'pedidos_updated_by_role_id_fkey';
            columns: ['updated_by_role_id'];
            isOneToOne: false;
            referencedRelation: 'usuarios_app_vw';
            referencedColumns: ['id'];
          },
        ];
      };
      perfiles_app: {
        Row: {
          activo: boolean;
          created_at: string;
          perfil: Json;
          preferencias: Json;
          updated_at: string;
          usuario_id: string;
        };
        Insert: {
          activo?: boolean;
          created_at?: string;
          perfil?: Json;
          preferencias?: Json;
          updated_at?: string;
          usuario_id: string;
        };
        Update: {
          activo?: boolean;
          created_at?: string;
          perfil?: Json;
          preferencias?: Json;
          updated_at?: string;
          usuario_id?: string;
        };
        Relationships: [];
      };
      roles_app: {
        Row: {
          activo: boolean;
          created_at: string;
          id: string;
          lavanderia_id: string | null;
          rol: Database['public']['Enums']['app_rol'];
          updated_at: string;
          usuario_id: string;
        };
        Insert: {
          activo?: boolean;
          created_at?: string;
          id?: string;
          lavanderia_id?: string | null;
          rol: Database['public']['Enums']['app_rol'];
          updated_at?: string;
          usuario_id: string;
        };
        Update: {
          activo?: boolean;
          created_at?: string;
          id?: string;
          lavanderia_id?: string | null;
          rol?: Database['public']['Enums']['app_rol'];
          updated_at?: string;
          usuario_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'roles_app_lavanderia_id_fkey';
            columns: ['lavanderia_id'];
            isOneToOne: false;
            referencedRelation: 'lavanderias';
            referencedColumns: ['id'];
          },
        ];
      };
      servicios: {
        Row: {
          activo: boolean;
          categoria: string | null;
          created_at: string;
          descripcion: string | null;
          id: string;
          imagen_url: string | null;
          lavanderia_id: string;
          nombre: string;
          orden: number | null;
          precio: number;
          unidad: Database['public']['Enums']['servicio_unidad'];
          updated_at: string;
        };
        Insert: {
          activo?: boolean;
          categoria?: string | null;
          created_at?: string;
          descripcion?: string | null;
          id?: string;
          imagen_url?: string | null;
          lavanderia_id: string;
          nombre: string;
          orden?: number | null;
          precio: number;
          unidad?: Database['public']['Enums']['servicio_unidad'];
          updated_at?: string;
        };
        Update: {
          activo?: boolean;
          categoria?: string | null;
          created_at?: string;
          descripcion?: string | null;
          id?: string;
          imagen_url?: string | null;
          lavanderia_id?: string;
          nombre?: string;
          orden?: number | null;
          precio?: number;
          unidad?: Database['public']['Enums']['servicio_unidad'];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'servicios_lavanderia_id_fkey';
            columns: ['lavanderia_id'];
            isOneToOne: false;
            referencedRelation: 'lavanderias';
            referencedColumns: ['id'];
          },
        ];
      };
      tickets: {
        Row: {
          created_at: string;
          intentos: number;
          last_try_at: string | null;
          lavanderia_id: string;
          pedido_id: string;
          pin_hash: string;
          qr_ref: string | null;
          updated_at: string;
          validado: boolean;
        };
        Insert: {
          created_at?: string;
          intentos?: number;
          last_try_at?: string | null;
          lavanderia_id: string;
          pedido_id: string;
          pin_hash: string;
          qr_ref?: string | null;
          updated_at?: string;
          validado?: boolean;
        };
        Update: {
          created_at?: string;
          intentos?: number;
          last_try_at?: string | null;
          lavanderia_id?: string;
          pedido_id?: string;
          pin_hash?: string;
          qr_ref?: string | null;
          updated_at?: string;
          validado?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: 'tickets_lavanderia_id_fkey';
            columns: ['lavanderia_id'];
            isOneToOne: false;
            referencedRelation: 'lavanderias';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tickets_pedido_id_fkey';
            columns: ['pedido_id'];
            isOneToOne: true;
            referencedRelation: 'pedidos';
            referencedColumns: ['id'];
          },
        ];
      };
      usuarios_app: {
        Row: {
          activo: boolean;
          created_at: string;
          id: string;
          lavanderia_id: string;
          perfil: Json;
          rol: Database['public']['Enums']['app_rol'];
          updated_at: string;
          usuario_id: string;
        };
        Insert: {
          activo?: boolean;
          created_at?: string;
          id?: string;
          lavanderia_id: string;
          perfil?: Json;
          rol: Database['public']['Enums']['app_rol'];
          updated_at?: string;
          usuario_id: string;
        };
        Update: {
          activo?: boolean;
          created_at?: string;
          id?: string;
          lavanderia_id?: string;
          perfil?: Json;
          rol?: Database['public']['Enums']['app_rol'];
          updated_at?: string;
          usuario_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'usuarios_app_lavanderia_id_fkey';
            columns: ['lavanderia_id'];
            isOneToOne: false;
            referencedRelation: 'lavanderias';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      usuarios_app_vw: {
        Row: {
          activo: boolean | null;
          created_at: string | null;
          id: string | null;
          lavanderia_id: string | null;
          perfil: Json | null;
          rol: Database['public']['Enums']['app_rol'] | null;
          updated_at: string | null;
          usuario_id: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'roles_app_lavanderia_id_fkey';
            columns: ['lavanderia_id'];
            isOneToOne: false;
            referencedRelation: 'lavanderias';
            referencedColumns: ['id'];
          },
        ];
      };
      v_mis_roles: {
        Row: {
          activo: boolean | null;
          created_at: string | null;
          id: string | null;
          lavanderia_id: string | null;
          perfil: Json | null;
          rol: Database['public']['Enums']['app_rol'] | null;
          updated_at: string | null;
          usuario_id: string | null;
        };
        Insert: {
          activo?: boolean | null;
          created_at?: string | null;
          id?: string | null;
          lavanderia_id?: string | null;
          perfil?: Json | null;
          rol?: Database['public']['Enums']['app_rol'] | null;
          updated_at?: string | null;
          usuario_id?: string | null;
        };
        Update: {
          activo?: boolean | null;
          created_at?: string | null;
          id?: string | null;
          lavanderia_id?: string | null;
          perfil?: Json | null;
          rol?: Database['public']['Enums']['app_rol'] | null;
          updated_at?: string | null;
          usuario_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'usuarios_app_lavanderia_id_fkey';
            columns: ['lavanderia_id'];
            isOneToOne: false;
            referencedRelation: 'lavanderias';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      app_rol: 'cliente' | 'repartidor' | 'encargado' | 'superadmin';
      entrega_tipo: 'pickup' | 'dropoff';
      notificacion_tipo:
        | 'pedido_creado'
        | 'pedido_en_proceso'
        | 'pedido_listo'
        | 'pedido_entregado'
        | 'promocion'
        | 'sistema';
      pedido_estado:
        | 'creado'
        | 'en_proceso'
        | 'listo'
        | 'entregado'
        | 'cancelado';
      servicio_unidad: 'pieza' | 'kg' | 'servicio';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_rol: ['cliente', 'repartidor', 'encargado', 'superadmin'],
      entrega_tipo: ['pickup', 'dropoff'],
      notificacion_tipo: [
        'pedido_creado',
        'pedido_en_proceso',
        'pedido_listo',
        'pedido_entregado',
        'promocion',
        'sistema',
      ],
      pedido_estado: ['creado', 'en_proceso', 'listo', 'entregado', 'cancelado'],
      servicio_unidad: ['pieza', 'kg', 'servicio'],
    },
  },
} as const;

