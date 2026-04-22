export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      carriers: {
        Row: {
          active: boolean
          created_at: string
          id: string
          mode: Database["public"]["Enums"]["freight_mode"]
          name: string
          scac: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          mode?: Database["public"]["Enums"]["freight_mode"]
          name: string
          scac?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          mode?: Database["public"]["Enums"]["freight_mode"]
          name?: string
          scac?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      document_extractions: {
        Row: {
          created_at: string
          document_id: string
          extraction_status: string
          extractor_name: string
          extractor_version: string
          id: string
          prompt_version: string | null
          raw_text: string | null
          structured_data: Json
          token_count: number | null
        }
        Insert: {
          created_at?: string
          document_id: string
          extraction_status?: string
          extractor_name: string
          extractor_version: string
          id?: string
          prompt_version?: string | null
          raw_text?: string | null
          structured_data?: Json
          token_count?: number | null
        }
        Update: {
          created_at?: string
          document_id?: string
          extraction_status?: string
          extractor_name?: string
          extractor_version?: string
          id?: string
          prompt_version?: string | null
          raw_text?: string | null
          structured_data?: Json
          token_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "document_extractions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          checksum: string | null
          claim_id: string | null
          created_at: string
          document_type: Database["public"]["Enums"]["document_type"]
          extraction_confidence: number | null
          file_name: string
          file_size_bytes: number | null
          id: string
          mime_type: string
          original_document_type:
            | Database["public"]["Enums"]["document_type"]
            | null
          parsing_status: Database["public"]["Enums"]["parsing_status"]
          shipment_id: string | null
          storage_path: string
          tenant_id: string
          uploaded_at: string
          uploaded_by: string | null
        }
        Insert: {
          checksum?: string | null
          claim_id?: string | null
          created_at?: string
          document_type?: Database["public"]["Enums"]["document_type"]
          extraction_confidence?: number | null
          file_name: string
          file_size_bytes?: number | null
          id?: string
          mime_type: string
          original_document_type?:
            | Database["public"]["Enums"]["document_type"]
            | null
          parsing_status?: Database["public"]["Enums"]["parsing_status"]
          shipment_id?: string | null
          storage_path: string
          tenant_id: string
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Update: {
          checksum?: string | null
          claim_id?: string | null
          created_at?: string
          document_type?: Database["public"]["Enums"]["document_type"]
          extraction_confidence?: number | null
          file_name?: string
          file_size_bytes?: number | null
          id?: string
          mime_type?: string
          original_document_type?:
            | Database["public"]["Enums"]["document_type"]
            | null
          parsing_status?: Database["public"]["Enums"]["parsing_status"]
          shipment_id?: string | null
          storage_path?: string
          tenant_id?: string
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      shipment_events: {
        Row: {
          created_at: string
          created_by: string | null
          event_source: string
          event_type: string
          id: string
          occurred_at: string | null
          severity: string | null
          shipment_id: string
          summary: string
          tenant_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          event_source: string
          event_type: string
          id?: string
          occurred_at?: string | null
          severity?: string | null
          shipment_id: string
          summary: string
          tenant_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          event_source?: string
          event_type?: string
          id?: string
          occurred_at?: string | null
          severity?: string | null
          shipment_id?: string
          summary?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shipment_events_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipment_events_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      shipments: {
        Row: {
          bol_number: string | null
          carrier_id: string | null
          commodity_description: string | null
          created_at: string
          delivery_date: string | null
          destination_city: string | null
          destination_name: string | null
          destination_state: string | null
          external_reference: string | null
          freight_charges_cents: number | null
          freight_mode: Database["public"]["Enums"]["freight_mode"]
          id: string
          import_batch_id: string | null
          invoice_value_cents: number | null
          nmfc_class: string | null
          origin_city: string | null
          origin_name: string | null
          origin_state: string | null
          packaging_type: string | null
          pro_number: string | null
          ship_date: string | null
          status: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          bol_number?: string | null
          carrier_id?: string | null
          commodity_description?: string | null
          created_at?: string
          delivery_date?: string | null
          destination_city?: string | null
          destination_name?: string | null
          destination_state?: string | null
          external_reference?: string | null
          freight_charges_cents?: number | null
          freight_mode?: Database["public"]["Enums"]["freight_mode"]
          id?: string
          import_batch_id?: string | null
          invoice_value_cents?: number | null
          nmfc_class?: string | null
          origin_city?: string | null
          origin_name?: string | null
          origin_state?: string | null
          packaging_type?: string | null
          pro_number?: string | null
          ship_date?: string | null
          status?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          bol_number?: string | null
          carrier_id?: string | null
          commodity_description?: string | null
          created_at?: string
          delivery_date?: string | null
          destination_city?: string | null
          destination_name?: string | null
          destination_state?: string | null
          external_reference?: string | null
          freight_charges_cents?: number | null
          freight_mode?: Database["public"]["Enums"]["freight_mode"]
          id?: string
          import_batch_id?: string | null
          invoice_value_cents?: number | null
          nmfc_class?: string | null
          origin_city?: string | null
          origin_name?: string | null
          origin_state?: string | null
          packaging_type?: string | null
          pro_number?: string | null
          ship_date?: string | null
          status?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shipments_carrier_id_fkey"
            columns: ["carrier_id"]
            isOneToOne: false
            referencedRelation: "carriers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          created_at: string
          id: string
          name: string
          plan: string
          slug: string
          updated_at: string
          vertical: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          plan?: string
          slug: string
          updated_at?: string
          vertical?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          plan?: string
          slug?: string
          updated_at?: string
          vertical?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_my_tenant_id: { Args: never; Returns: string }
    }
    Enums: {
      document_type:
        | "bol"
        | "pod"
        | "invoice"
        | "photo"
        | "inspection"
        | "tariff"
        | "email"
        | "carrier_response"
        | "appeal"
        | "other"
      freight_mode: "ltl" | "ftl" | "parcel" | "intermodal" | "other"
      parsing_status: "pending" | "processing" | "complete" | "failed"
      user_role: "operator" | "claims_manager" | "finance" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      document_type: [
        "bol",
        "pod",
        "invoice",
        "photo",
        "inspection",
        "tariff",
        "email",
        "carrier_response",
        "appeal",
        "other",
      ],
      freight_mode: ["ltl", "ftl", "parcel", "intermodal", "other"],
      parsing_status: ["pending", "processing", "complete", "failed"],
      user_role: ["operator", "claims_manager", "finance", "admin"],
    },
  },
} as const
