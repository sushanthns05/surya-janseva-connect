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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          new_value: Json | null
          old_value: Json | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          new_value?: Json | null
          old_value?: Json | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          new_value?: Json | null
          old_value?: Json | null
        }
        Relationships: []
      }
      complaint_attachments: {
        Row: {
          complaint_id: string
          created_at: string
          file_name: string
          file_path: string
          file_size: number
          id: string
          is_resolution_evidence: boolean
          mime_type: string
          uploaded_by: string | null
        }
        Insert: {
          complaint_id: string
          created_at?: string
          file_name: string
          file_path: string
          file_size?: number
          id?: string
          is_resolution_evidence?: boolean
          mime_type: string
          uploaded_by?: string | null
        }
        Update: {
          complaint_id?: string
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number
          id?: string
          is_resolution_evidence?: boolean
          mime_type?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "complaint_attachments_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "complaints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "complaint_attachments_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "public_complaints"
            referencedColumns: ["id"]
          },
        ]
      }
      complaint_categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string
          id: string
          is_active: boolean
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string
          id?: string
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      complaint_comments: {
        Row: {
          author_id: string
          body: string
          complaint_id: string
          created_at: string
          id: string
          is_internal: boolean
        }
        Insert: {
          author_id: string
          body: string
          complaint_id: string
          created_at?: string
          id?: string
          is_internal?: boolean
        }
        Update: {
          author_id?: string
          body?: string
          complaint_id?: string
          created_at?: string
          id?: string
          is_internal?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "complaint_comments_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "complaints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "complaint_comments_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "public_complaints"
            referencedColumns: ["id"]
          },
        ]
      }
      complaint_status_history: {
        Row: {
          changed_by: string | null
          comment: string | null
          complaint_id: string
          created_at: string
          id: string
          new_status: Database["public"]["Enums"]["complaint_status"]
          previous_status:
            | Database["public"]["Enums"]["complaint_status"]
            | null
        }
        Insert: {
          changed_by?: string | null
          comment?: string | null
          complaint_id: string
          created_at?: string
          id?: string
          new_status: Database["public"]["Enums"]["complaint_status"]
          previous_status?:
            | Database["public"]["Enums"]["complaint_status"]
            | null
        }
        Update: {
          changed_by?: string | null
          comment?: string | null
          complaint_id?: string
          created_at?: string
          id?: string
          new_status?: Database["public"]["Enums"]["complaint_status"]
          previous_status?:
            | Database["public"]["Enums"]["complaint_status"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "complaint_status_history_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "complaints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "complaint_status_history_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "public_complaints"
            referencedColumns: ["id"]
          },
        ]
      }
      complaints: {
        Row: {
          address: string | null
          category_id: string | null
          citizen_id: string
          city: string | null
          complaint_type: Database["public"]["Enums"]["complaint_type"]
          created_at: string
          department_id: string | null
          description: string
          district: string
          duplicate_of: string | null
          escalation_level: number
          grievance_id: string
          id: string
          is_demo: boolean
          latitude: number | null
          locality: string | null
          longitude: number | null
          priority: Database["public"]["Enums"]["complaint_priority"]
          public_impact: string | null
          resolution_notes: string | null
          resolved_at: string | null
          state: string
          status: Database["public"]["Enums"]["complaint_status"]
          suggested_improvement: string | null
          title: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          category_id?: string | null
          citizen_id: string
          city?: string | null
          complaint_type?: Database["public"]["Enums"]["complaint_type"]
          created_at?: string
          department_id?: string | null
          description: string
          district: string
          duplicate_of?: string | null
          escalation_level?: number
          grievance_id?: string
          id?: string
          is_demo?: boolean
          latitude?: number | null
          locality?: string | null
          longitude?: number | null
          priority?: Database["public"]["Enums"]["complaint_priority"]
          public_impact?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          state: string
          status?: Database["public"]["Enums"]["complaint_status"]
          suggested_improvement?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          category_id?: string | null
          citizen_id?: string
          city?: string | null
          complaint_type?: Database["public"]["Enums"]["complaint_type"]
          created_at?: string
          department_id?: string | null
          description?: string
          district?: string
          duplicate_of?: string | null
          escalation_level?: number
          grievance_id?: string
          id?: string
          is_demo?: boolean
          latitude?: number | null
          locality?: string | null
          longitude?: number | null
          priority?: Database["public"]["Enums"]["complaint_priority"]
          public_impact?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          state?: string
          status?: Database["public"]["Enums"]["complaint_status"]
          suggested_improvement?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "complaints_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "complaint_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "complaints_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "complaints_duplicate_of_fkey"
            columns: ["duplicate_of"]
            isOneToOne: false
            referencedRelation: "complaints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "complaints_duplicate_of_fkey"
            columns: ["duplicate_of"]
            isOneToOne: false
            referencedRelation: "public_complaints"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          category_slugs: string[]
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          district: string | null
          id: string
          is_active: boolean
          jurisdiction: string
          name: string
          state: string | null
          updated_at: string
        }
        Insert: {
          category_slugs?: string[]
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          district?: string | null
          id?: string
          is_active?: boolean
          jurisdiction?: string
          name: string
          state?: string | null
          updated_at?: string
        }
        Update: {
          category_slugs?: string[]
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          district?: string | null
          id?: string
          is_active?: boolean
          jurisdiction?: string
          name?: string
          state?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      escalations: {
        Row: {
          complaint_id: string
          created_at: string
          created_by: string | null
          escalated_to: string | null
          id: string
          level: number
          reason: string | null
        }
        Insert: {
          complaint_id: string
          created_at?: string
          created_by?: string | null
          escalated_to?: string | null
          id?: string
          level?: number
          reason?: string | null
        }
        Update: {
          complaint_id?: string
          created_at?: string
          created_by?: string | null
          escalated_to?: string | null
          id?: string
          level?: number
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "escalations_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "complaints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "escalations_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "public_complaints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "escalations_escalated_to_fkey"
            columns: ["escalated_to"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          citizen_id: string
          comment: string | null
          complaint_id: string
          created_at: string
          id: string
          outcome: Database["public"]["Enums"]["feedback_outcome"]
          rating: number
        }
        Insert: {
          citizen_id: string
          comment?: string | null
          complaint_id: string
          created_at?: string
          id?: string
          outcome: Database["public"]["Enums"]["feedback_outcome"]
          rating: number
        }
        Update: {
          citizen_id?: string
          comment?: string | null
          complaint_id?: string
          created_at?: string
          id?: string
          outcome?: Database["public"]["Enums"]["feedback_outcome"]
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "feedback_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: true
            referencedRelation: "complaints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: true
            referencedRelation: "public_complaints"
            referencedColumns: ["id"]
          },
        ]
      }
      moderation_actions: {
        Row: {
          action: string
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          moderator_id: string | null
          reason: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          moderator_id?: string | null
          reason?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          moderator_id?: string | null
          reason?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      phone_verifications: {
        Row: {
          attempts: number
          code: string
          created_at: string
          expires_at: string
          id: string
          phone: string
          verified_at: string | null
        }
        Insert: {
          attempts?: number
          code: string
          created_at?: string
          expires_at: string
          id?: string
          phone: string
          verified_at?: string | null
        }
        Update: {
          attempts?: number
          code?: string
          created_at?: string
          expires_at?: string
          id?: string
          phone?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          district: string | null
          email: string | null
          full_name: string
          id: string
          mobile: string | null
          preferred_language: string
          state: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          district?: string | null
          email?: string | null
          full_name?: string
          id: string
          mobile?: string | null
          preferred_language?: string
          state?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          district?: string | null
          email?: string | null
          full_name?: string
          id?: string
          mobile?: string | null
          preferred_language?: string
          state?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      suggestion_comments: {
        Row: {
          author_id: string
          body: string
          created_at: string
          id: string
          is_hidden: boolean
          suggestion_id: string
        }
        Insert: {
          author_id: string
          body: string
          created_at?: string
          id?: string
          is_hidden?: boolean
          suggestion_id: string
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          id?: string
          is_hidden?: boolean
          suggestion_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "suggestion_comments_suggestion_id_fkey"
            columns: ["suggestion_id"]
            isOneToOne: false
            referencedRelation: "suggestions"
            referencedColumns: ["id"]
          },
        ]
      }
      suggestion_votes: {
        Row: {
          created_at: string
          id: string
          suggestion_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          suggestion_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          suggestion_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "suggestion_votes_suggestion_id_fkey"
            columns: ["suggestion_id"]
            isOneToOne: false
            referencedRelation: "suggestions"
            referencedColumns: ["id"]
          },
        ]
      }
      suggestions: {
        Row: {
          category_id: string | null
          citizen_id: string
          created_at: string
          description: string
          district: string | null
          expected_benefit: string | null
          id: string
          is_hidden: boolean
          locality: string | null
          state: string | null
          status: string
          title: string
          updated_at: string
          vote_count: number
        }
        Insert: {
          category_id?: string | null
          citizen_id: string
          created_at?: string
          description: string
          district?: string | null
          expected_benefit?: string | null
          id?: string
          is_hidden?: boolean
          locality?: string | null
          state?: string | null
          status?: string
          title: string
          updated_at?: string
          vote_count?: number
        }
        Update: {
          category_id?: string | null
          citizen_id?: string
          created_at?: string
          description?: string
          district?: string | null
          expected_benefit?: string | null
          id?: string
          is_hidden?: boolean
          locality?: string | null
          state?: string | null
          status?: string
          title?: string
          updated_at?: string
          vote_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "suggestions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "complaint_categories"
            referencedColumns: ["id"]
          },
        ]
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
      public_complaints: {
        Row: {
          category_id: string | null
          category_name: string | null
          category_slug: string | null
          city: string | null
          complaint_type: Database["public"]["Enums"]["complaint_type"] | null
          created_at: string | null
          district: string | null
          escalation_level: number | null
          grievance_id: string | null
          id: string | null
          latitude: number | null
          locality: string | null
          longitude: number | null
          priority: Database["public"]["Enums"]["complaint_priority"] | null
          resolved_at: string | null
          state: string | null
          status: Database["public"]["Enums"]["complaint_status"] | null
          summary: string | null
          title: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "complaints_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "complaint_categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      next_grievance_id: { Args: never; Returns: string }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "verification_admin"
        | "department_admin"
        | "moderator"
        | "citizen"
      complaint_priority: "low" | "medium" | "high" | "critical"
      complaint_status:
        | "submitted"
        | "under_verification"
        | "verified"
        | "assigned"
        | "forwarded"
        | "action_initiated"
        | "in_progress"
        | "resolved"
        | "closed"
        | "rejected"
        | "duplicate"
        | "escalated"
      complaint_type:
        | "public_service"
        | "civic_infrastructure"
        | "public_facility"
        | "safety_concern"
        | "improvement_suggestion"
        | "other"
      feedback_outcome: "yes" | "partially" | "no"
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
      app_role: [
        "super_admin",
        "verification_admin",
        "department_admin",
        "moderator",
        "citizen",
      ],
      complaint_priority: ["low", "medium", "high", "critical"],
      complaint_status: [
        "submitted",
        "under_verification",
        "verified",
        "assigned",
        "forwarded",
        "action_initiated",
        "in_progress",
        "resolved",
        "closed",
        "rejected",
        "duplicate",
        "escalated",
      ],
      complaint_type: [
        "public_service",
        "civic_infrastructure",
        "public_facility",
        "safety_concern",
        "improvement_suggestion",
        "other",
      ],
      feedback_outcome: ["yes", "partially", "no"],
    },
  },
} as const
