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
  public: {
    Tables: {
      activity_safety_rules: {
        Row: {
          active: boolean
          category: string
          created_at: string
          id: string
          safety_instruction: string
          severity: string
          source: string | null
          source_url: string | null
          trigger: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          category: string
          created_at?: string
          id?: string
          safety_instruction: string
          severity?: string
          source?: string | null
          source_url?: string | null
          trigger: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          category?: string
          created_at?: string
          id?: string
          safety_instruction?: string
          severity?: string
          source?: string | null
          source_url?: string | null
          trigger?: string
          updated_at?: string
        }
        Relationships: []
      }
      card_versions: {
        Row: {
          card_id: string
          change_note: string | null
          content: Json
          created_at: string
          created_by: string | null
          id: string
          version_number: number
        }
        Insert: {
          card_id: string
          change_note?: string | null
          content: Json
          created_at?: string
          created_by?: string | null
          id?: string
          version_number: number
        }
        Update: {
          card_id?: string
          change_note?: string | null
          content?: Json
          created_at?: string
          created_by?: string | null
          id?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "card_versions_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      cards: {
        Row: {
          activity_mechanics: Json
          activity_steps: Json
          activity_type: string
          age_group: Database["public"]["Enums"]["age_group"]
          card_number: number
          card_type: string
          caregiver_energy: string | null
          created_at: string
          created_by: string | null
          did_you_know: string
          duration: string
          evidence_level: string | null
          extended_content: Json | null
          fact_source: string | null
          fact_source_url: string | null
          fact_statement: string | null
          fact_verified: boolean
          fact_verified_at: string | null
          generation_rationale: string | null
          good_when: Json
          id: string
          illustration_prompt: string | null
          illustration_status: string
          illustration_url: string | null
          is_demo: boolean
          is_locked: boolean
          materials: Json
          needs_shortening: boolean
          observations: string
          parent_category: string | null
          pause_signs: string
          primary_development_area: string
          print_content: Json | null
          purpose: string
          quality_score: Json | null
          rejection_reason: string | null
          safety: string
          secondary_development_areas: Json
          setup_level: string | null
          similarity_score: number | null
          status: Database["public"]["Enums"]["card_status"]
          title: string
          updated_at: string
          variations: Json
          version: number
        }
        Insert: {
          activity_mechanics?: Json
          activity_steps?: Json
          activity_type?: string
          age_group: Database["public"]["Enums"]["age_group"]
          card_number?: number
          card_type?: string
          caregiver_energy?: string | null
          created_at?: string
          created_by?: string | null
          did_you_know?: string
          duration?: string
          evidence_level?: string | null
          extended_content?: Json | null
          fact_source?: string | null
          fact_source_url?: string | null
          fact_statement?: string | null
          fact_verified?: boolean
          fact_verified_at?: string | null
          generation_rationale?: string | null
          good_when?: Json
          id?: string
          illustration_prompt?: string | null
          illustration_status?: string
          illustration_url?: string | null
          is_demo?: boolean
          is_locked?: boolean
          materials?: Json
          needs_shortening?: boolean
          observations?: string
          parent_category?: string | null
          pause_signs?: string
          primary_development_area?: string
          print_content?: Json | null
          purpose?: string
          quality_score?: Json | null
          rejection_reason?: string | null
          safety?: string
          secondary_development_areas?: Json
          setup_level?: string | null
          similarity_score?: number | null
          status?: Database["public"]["Enums"]["card_status"]
          title: string
          updated_at?: string
          variations?: Json
          version?: number
        }
        Update: {
          activity_mechanics?: Json
          activity_steps?: Json
          activity_type?: string
          age_group?: Database["public"]["Enums"]["age_group"]
          card_number?: number
          card_type?: string
          caregiver_energy?: string | null
          created_at?: string
          created_by?: string | null
          did_you_know?: string
          duration?: string
          evidence_level?: string | null
          extended_content?: Json | null
          fact_source?: string | null
          fact_source_url?: string | null
          fact_statement?: string | null
          fact_verified?: boolean
          fact_verified_at?: string | null
          generation_rationale?: string | null
          good_when?: Json
          id?: string
          illustration_prompt?: string | null
          illustration_status?: string
          illustration_url?: string | null
          is_demo?: boolean
          is_locked?: boolean
          materials?: Json
          needs_shortening?: boolean
          observations?: string
          parent_category?: string | null
          pause_signs?: string
          primary_development_area?: string
          print_content?: Json | null
          purpose?: string
          quality_score?: Json | null
          rejection_reason?: string | null
          safety?: string
          secondary_development_areas?: Json
          setup_level?: string | null
          similarity_score?: number | null
          status?: Database["public"]["Enums"]["card_status"]
          title?: string
          updated_at?: string
          variations?: Json
          version?: number
        }
        Relationships: []
      }
      design_guidelines: {
        Row: {
          category: string
          content: string
          created_at: string
          id: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          content?: string
          created_at?: string
          id?: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          id?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      development_areas: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      project_settings: {
        Row: {
          created_at: string
          default_language: string
          id: string
          project_name: string
          target_card_count: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_language?: string
          id?: string
          project_name?: string
          target_card_count?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_language?: string
          id?: string
          project_name?: string
          target_card_count?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      age_group: "0-2m" | "2-4m" | "4-6m" | "6-9m" | "9-12m"
      app_role: "admin" | "editor"
      card_status: "draft" | "approved" | "rejected"
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
  public: {
    Enums: {
      age_group: ["0-2m", "2-4m", "4-6m", "6-9m", "9-12m"],
      app_role: ["admin", "editor"],
      card_status: ["draft", "approved", "rejected"],
    },
  },
} as const
