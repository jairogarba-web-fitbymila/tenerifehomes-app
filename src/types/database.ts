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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      access_codes: {
        Row: {
          agent_id: string
          booking_id: string | null
          code: string
          created_at: string
          id: string
          last_used_at: string | null
          max_uses: number | null
          name: string | null
          notes: string | null
          sent_at: string | null
          sent_to_guest: boolean | null
          sent_via: Database["public"]["Enums"]["message_channel"] | null
          smart_lock_id: string
          status: Database["public"]["Enums"]["access_code_status"] | null
          times_used: number | null
          type: string | null
          updated_at: string
          valid_from: string
          valid_until: string
        }
        Insert: {
          agent_id: string
          booking_id?: string | null
          code: string
          created_at?: string
          id?: string
          last_used_at?: string | null
          max_uses?: number | null
          name?: string | null
          notes?: string | null
          sent_at?: string | null
          sent_to_guest?: boolean | null
          sent_via?: Database["public"]["Enums"]["message_channel"] | null
          smart_lock_id: string
          status?: Database["public"]["Enums"]["access_code_status"] | null
          times_used?: number | null
          type?: string | null
          updated_at?: string
          valid_from: string
          valid_until: string
        }
        Update: {
          agent_id?: string
          booking_id?: string | null
          code?: string
          created_at?: string
          id?: string
          last_used_at?: string | null
          max_uses?: number | null
          name?: string | null
          notes?: string | null
          sent_at?: string | null
          sent_to_guest?: boolean | null
          sent_via?: Database["public"]["Enums"]["message_channel"] | null
          smart_lock_id?: string
          status?: Database["public"]["Enums"]["access_code_status"] | null
          times_used?: number | null
          type?: string | null
          updated_at?: string
          valid_from?: string
          valid_until?: string
        }
        Relationships: [
          {
            foreignKeyName: "access_codes_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "access_codes_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "access_codes_smart_lock_id_fkey"
            columns: ["smart_lock_id"]
            isOneToOne: false
            referencedRelation: "smart_locks"
            referencedColumns: ["id"]
          },
        ]
      }
      access_log: {
        Row: {
          access_code_id: string | null
          code_used: string | null
          created_at: string
          event_type: string
          id: string
          method: string | null
          property_id: string
          smart_lock_id: string
          timestamp: string
          user_name: string | null
        }
        Insert: {
          access_code_id?: string | null
          code_used?: string | null
          created_at?: string
          event_type: string
          id?: string
          method?: string | null
          property_id: string
          smart_lock_id: string
          timestamp?: string
          user_name?: string | null
        }
        Update: {
          access_code_id?: string | null
          code_used?: string | null
          created_at?: string
          event_type?: string
          id?: string
          method?: string | null
          property_id?: string
          smart_lock_id?: string
          timestamp?: string
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "access_log_access_code_id_fkey"
            columns: ["access_code_id"]
            isOneToOne: false
            referencedRelation: "access_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "access_log_smart_lock_id_fkey"
            columns: ["smart_lock_id"]
            isOneToOne: false
            referencedRelation: "smart_locks"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_log: {
        Row: {
          action: string
          agent_id: string | null
          changes: Json | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: unknown
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          agent_id?: string | null
          changes?: Json | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: unknown
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          agent_id?: string | null
          changes?: Json | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: unknown
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      agencies: {
        Row: {
          address: string | null
          country: string | null
          cover_url: string | null
          created_at: string
          custom_domain: string | null
          description: Json | null
          email: string | null
          id: string
          is_verified: boolean | null
          license_number: string | null
          logo_url: string | null
          max_agents: number | null
          municipality: string | null
          name: string
          owner_id: string
          palette: Database["public"]["Enums"]["palette_name"] | null
          phone: string | null
          region: string | null
          settings: Json | null
          slug: string
          status: Database["public"]["Enums"]["agent_status"] | null
          tax_id: string | null
          template: Database["public"]["Enums"]["template_name"] | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          country?: string | null
          cover_url?: string | null
          created_at?: string
          custom_domain?: string | null
          description?: Json | null
          email?: string | null
          id?: string
          is_verified?: boolean | null
          license_number?: string | null
          logo_url?: string | null
          max_agents?: number | null
          municipality?: string | null
          name: string
          owner_id: string
          palette?: Database["public"]["Enums"]["palette_name"] | null
          phone?: string | null
          region?: string | null
          settings?: Json | null
          slug: string
          status?: Database["public"]["Enums"]["agent_status"] | null
          tax_id?: string | null
          template?: Database["public"]["Enums"]["template_name"] | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          country?: string | null
          cover_url?: string | null
          created_at?: string
          custom_domain?: string | null
          description?: Json | null
          email?: string | null
          id?: string
          is_verified?: boolean | null
          license_number?: string | null
          logo_url?: string | null
          max_agents?: number | null
          municipality?: string | null
          name?: string
          owner_id?: string
          palette?: Database["public"]["Enums"]["palette_name"] | null
          phone?: string | null
          region?: string | null
          settings?: Json | null
          slug?: string
          status?: Database["public"]["Enums"]["agent_status"] | null
          tax_id?: string | null
          template?: Database["public"]["Enums"]["template_name"] | null
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agencies_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_badges: {
        Row: {
          agent_id: string
          badge_code: string
          badge_description: string | null
          badge_icon: string | null
          badge_name: string
          earned_at: string
          id: string
        }
        Insert: {
          agent_id: string
          badge_code: string
          badge_description?: string | null
          badge_icon?: string | null
          badge_name: string
          earned_at?: string
          id?: string
        }
        Update: {
          agent_id?: string
          badge_code?: string
          badge_description?: string | null
          badge_icon?: string | null
          badge_name?: string
          earned_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_badges_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_daily_stats: {
        Row: {
          active_properties: number | null
          agent_id: string
          bookings_received: number | null
          calls_received: number | null
          created_at: string
          date: string
          email_clicks: number | null
          email_opens: number | null
          emails_received: number | null
          emails_sent: number | null
          id: string
          leads_contacted: number | null
          leads_converted: number | null
          new_leads: number | null
          new_properties: number | null
          occupancy_rate: number | null
          profile_views: number | null
          property_views: number | null
          rental_income: number | null
          total_leads: number | null
          total_properties: number | null
          whatsapp_received: number | null
        }
        Insert: {
          active_properties?: number | null
          agent_id: string
          bookings_received?: number | null
          calls_received?: number | null
          created_at?: string
          date: string
          email_clicks?: number | null
          email_opens?: number | null
          emails_received?: number | null
          emails_sent?: number | null
          id?: string
          leads_contacted?: number | null
          leads_converted?: number | null
          new_leads?: number | null
          new_properties?: number | null
          occupancy_rate?: number | null
          profile_views?: number | null
          property_views?: number | null
          rental_income?: number | null
          total_leads?: number | null
          total_properties?: number | null
          whatsapp_received?: number | null
        }
        Update: {
          active_properties?: number | null
          agent_id?: string
          bookings_received?: number | null
          calls_received?: number | null
          created_at?: string
          date?: string
          email_clicks?: number | null
          email_opens?: number | null
          emails_received?: number | null
          emails_sent?: number | null
          id?: string
          leads_contacted?: number | null
          leads_converted?: number | null
          new_leads?: number | null
          new_properties?: number | null
          occupancy_rate?: number | null
          profile_views?: number | null
          property_views?: number | null
          rental_income?: number | null
          total_leads?: number | null
          total_properties?: number | null
          whatsapp_received?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_daily_stats_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_module_overrides: {
        Row: {
          agent_id: string
          created_at: string | null
          expires_at: string | null
          granted_by: string | null
          id: string
          is_enabled: boolean
          module_id: string
          reason: string | null
          updated_at: string | null
        }
        Insert: {
          agent_id: string
          created_at?: string | null
          expires_at?: string | null
          granted_by?: string | null
          id?: string
          is_enabled?: boolean
          module_id: string
          reason?: string | null
          updated_at?: string | null
        }
        Update: {
          agent_id?: string
          created_at?: string | null
          expires_at?: string | null
          granted_by?: string | null
          id?: string
          is_enabled?: boolean
          module_id?: string
          reason?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_module_overrides_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agent_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_module_overrides_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "agent_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_module_overrides_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "platform_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_modules: {
        Row: {
          activated_at: string | null
          agent_id: string
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          module_slug: string
          stripe_subscription_item_id: string | null
          updated_at: string | null
        }
        Insert: {
          activated_at?: string | null
          agent_id: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          module_slug: string
          stripe_subscription_item_id?: string | null
          updated_at?: string | null
        }
        Update: {
          activated_at?: string | null
          agent_id?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          module_slug?: string
          stripe_subscription_item_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_modules_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agent_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_profiles: {
        Row: {
          address: string | null
          bio: string | null
          bio_photo_url: string | null
          business_name: string
          business_type: Database["public"]["Enums"]["business_type"] | null
          city: string | null
          color_palette: string | null
          created_at: string | null
          custom_domain: string | null
          email: string | null
          id: string
          is_active: boolean | null
          languages: string[] | null
          logo_url: string | null
          phone: string | null
          plan: Database["public"]["Enums"]["plan_type"] | null
          quote: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          social_links: Json | null
          stats: Json | null
          template: Database["public"]["Enums"]["template_type"] | null
          updated_at: string | null
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          bio?: string | null
          bio_photo_url?: string | null
          business_name: string
          business_type?: Database["public"]["Enums"]["business_type"] | null
          city?: string | null
          color_palette?: string | null
          created_at?: string | null
          custom_domain?: string | null
          email?: string | null
          id: string
          is_active?: boolean | null
          languages?: string[] | null
          logo_url?: string | null
          phone?: string | null
          plan?: Database["public"]["Enums"]["plan_type"] | null
          quote?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          social_links?: Json | null
          stats?: Json | null
          template?: Database["public"]["Enums"]["template_type"] | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          bio?: string | null
          bio_photo_url?: string | null
          business_name?: string
          business_type?: Database["public"]["Enums"]["business_type"] | null
          city?: string | null
          color_palette?: string | null
          created_at?: string | null
          custom_domain?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          languages?: string[] | null
          logo_url?: string | null
          phone?: string | null
          plan?: Database["public"]["Enums"]["plan_type"] | null
          quote?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          social_links?: Json | null
          stats?: Json | null
          template?: Database["public"]["Enums"]["template_type"] | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      agent_reviews: {
        Row: {
          agent_id: string
          comment: string | null
          created_at: string
          id: string
          is_published: boolean | null
          is_verified: boolean | null
          language: string | null
          property_id: string | null
          rating: number
          responded_at: string | null
          response: string | null
          reviewer_email: string | null
          reviewer_name: string
          title: string | null
        }
        Insert: {
          agent_id: string
          comment?: string | null
          created_at?: string
          id?: string
          is_published?: boolean | null
          is_verified?: boolean | null
          language?: string | null
          property_id?: string | null
          rating: number
          responded_at?: string | null
          response?: string | null
          reviewer_email?: string | null
          reviewer_name: string
          title?: string | null
        }
        Update: {
          agent_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          is_published?: boolean | null
          is_verified?: boolean | null
          language?: string | null
          property_id?: string | null
          rating?: number
          responded_at?: string | null
          response?: string | null
          reviewer_email?: string | null
          reviewer_name?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_reviews_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_sections: {
        Row: {
          agent_id: string
          created_at: string | null
          custom_config: Json | null
          custom_title: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          section_key: string
          updated_at: string | null
        }
        Insert: {
          agent_id: string
          created_at?: string | null
          custom_config?: Json | null
          custom_title?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          section_key: string
          updated_at?: string | null
        }
        Update: {
          agent_id?: string
          created_at?: string | null
          custom_config?: Json | null
          custom_title?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          section_key?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_sections_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agent_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      agents: {
        Row: {
          agency_id: string | null
          badges: string[] | null
          bio: Json | null
          certifications: string[] | null
          commission_rate: number | null
          cover_url: string | null
          created_at: string
          custom_css: string | null
          display_name: string
          email: string
          hour_rate: number | null
          id: string
          igic_rate: number | null
          is_featured: boolean | null
          km_rate: number | null
          languages: string[] | null
          last_active_at: string | null
          level: number | null
          mls_commission_split: number | null
          mls_participant: boolean | null
          palette: Database["public"]["Enums"]["palette_name"] | null
          phone: string | null
          photo_url: string | null
          points: number | null
          rating: number | null
          review_count: number | null
          seo_description: Json | null
          seo_title: Json | null
          slug: string
          social_links: Json | null
          specialties: string[] | null
          status: Database["public"]["Enums"]["agent_status"] | null
          tax_id: string | null
          tax_regime: string | null
          template: Database["public"]["Enums"]["template_name"] | null
          total_sales: number | null
          updated_at: string
          user_id: string
          vacation_rental_manager: boolean | null
          whatsapp: string | null
          years_experience: number | null
          zones: string[] | null
        }
        Insert: {
          agency_id?: string | null
          badges?: string[] | null
          bio?: Json | null
          certifications?: string[] | null
          commission_rate?: number | null
          cover_url?: string | null
          created_at?: string
          custom_css?: string | null
          display_name: string
          email: string
          hour_rate?: number | null
          id?: string
          igic_rate?: number | null
          is_featured?: boolean | null
          km_rate?: number | null
          languages?: string[] | null
          last_active_at?: string | null
          level?: number | null
          mls_commission_split?: number | null
          mls_participant?: boolean | null
          palette?: Database["public"]["Enums"]["palette_name"] | null
          phone?: string | null
          photo_url?: string | null
          points?: number | null
          rating?: number | null
          review_count?: number | null
          seo_description?: Json | null
          seo_title?: Json | null
          slug: string
          social_links?: Json | null
          specialties?: string[] | null
          status?: Database["public"]["Enums"]["agent_status"] | null
          tax_id?: string | null
          tax_regime?: string | null
          template?: Database["public"]["Enums"]["template_name"] | null
          total_sales?: number | null
          updated_at?: string
          user_id: string
          vacation_rental_manager?: boolean | null
          whatsapp?: string | null
          years_experience?: number | null
          zones?: string[] | null
        }
        Update: {
          agency_id?: string | null
          badges?: string[] | null
          bio?: Json | null
          certifications?: string[] | null
          commission_rate?: number | null
          cover_url?: string | null
          created_at?: string
          custom_css?: string | null
          display_name?: string
          email?: string
          hour_rate?: number | null
          id?: string
          igic_rate?: number | null
          is_featured?: boolean | null
          km_rate?: number | null
          languages?: string[] | null
          last_active_at?: string | null
          level?: number | null
          mls_commission_split?: number | null
          mls_participant?: boolean | null
          palette?: Database["public"]["Enums"]["palette_name"] | null
          phone?: string | null
          photo_url?: string | null
          points?: number | null
          rating?: number | null
          review_count?: number | null
          seo_description?: Json | null
          seo_title?: Json | null
          slug?: string
          social_links?: Json | null
          specialties?: string[] | null
          status?: Database["public"]["Enums"]["agent_status"] | null
          tax_id?: string | null
          tax_regime?: string | null
          template?: Database["public"]["Enums"]["template_name"] | null
          total_sales?: number | null
          updated_at?: string
          user_id?: string
          vacation_rental_manager?: boolean | null
          whatsapp?: string | null
          years_experience?: number | null
          zones?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "agents_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          agent_id: string
          appointment_type: string | null
          created_at: string
          description: string | null
          end_time: string
          id: string
          lead_id: string | null
          location: string | null
          notes: string | null
          outcome: string | null
          property_id: string | null
          reminder_sent: boolean | null
          start_time: string
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          agent_id: string
          appointment_type?: string | null
          created_at?: string
          description?: string | null
          end_time: string
          id?: string
          lead_id?: string | null
          location?: string | null
          notes?: string | null
          outcome?: string | null
          property_id?: string | null
          reminder_sent?: boolean | null
          start_time: string
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          agent_id?: string
          appointment_type?: string | null
          created_at?: string
          description?: string | null
          end_time?: string
          id?: string
          lead_id?: string | null
          location?: string | null
          notes?: string | null
          outcome?: string | null
          property_id?: string | null
          reminder_sent?: boolean | null
          start_time?: string
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      auto_message_log: {
        Row: {
          agent_id: string
          booking_id: string | null
          channel: Database["public"]["Enums"]["message_channel"]
          created_at: string
          error_message: string | null
          id: string
          lead_id: string | null
          recipient: string
          sent_at: string | null
          status: Database["public"]["Enums"]["message_status"] | null
          template_id: string
        }
        Insert: {
          agent_id: string
          booking_id?: string | null
          channel: Database["public"]["Enums"]["message_channel"]
          created_at?: string
          error_message?: string | null
          id?: string
          lead_id?: string | null
          recipient: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["message_status"] | null
          template_id: string
        }
        Update: {
          agent_id?: string
          booking_id?: string | null
          channel?: Database["public"]["Enums"]["message_channel"]
          created_at?: string
          error_message?: string | null
          id?: string
          lead_id?: string | null
          recipient?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["message_status"] | null
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "auto_message_log_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auto_message_log_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auto_message_log_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auto_message_log_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "message_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_costs: {
        Row: {
          agent_id: string
          amount: number
          booking_id: string | null
          category: string
          created_at: string
          date: string
          description: string | null
          id: string
          igic_amount: number | null
          is_reimbursed: boolean | null
          notes: string | null
          owner_id: string | null
          paid_by: string
          period_month: number | null
          period_year: number | null
          property_id: string
          receipt_number: string | null
          receipt_url: string | null
          reimbursed_at: string | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          agent_id: string
          amount: number
          booking_id?: string | null
          category: string
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          igic_amount?: number | null
          is_reimbursed?: boolean | null
          notes?: string | null
          owner_id?: string | null
          paid_by?: string
          period_month?: number | null
          period_year?: number | null
          property_id: string
          receipt_number?: string | null
          receipt_url?: string | null
          reimbursed_at?: string | null
          total_amount: number
          updated_at?: string
        }
        Update: {
          agent_id?: string
          amount?: number
          booking_id?: string | null
          category?: string
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          igic_amount?: number | null
          is_reimbursed?: boolean | null
          notes?: string | null
          owner_id?: string | null
          paid_by?: string
          period_month?: number | null
          period_year?: number | null
          property_id?: string
          receipt_number?: string | null
          receipt_url?: string | null
          reimbursed_at?: string | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_costs_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_costs_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_costs_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "property_owners"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          access_code: string | null
          actual_check_in: string | null
          actual_check_out: string | null
          agent_commission: number | null
          agent_id: string
          channel_id: string | null
          check_in: string
          check_out: string
          cleaning_fee: number | null
          created_at: string
          external_booking_id: string | null
          guest_count: number | null
          guest_country: string | null
          guest_email: string | null
          guest_name: string
          guest_notes: string | null
          guest_phone: string | null
          id: string
          internal_notes: string | null
          key_handover: string | null
          net_to_owner: number | null
          nights: number | null
          owner_id: string | null
          platform_commission: number | null
          platform_commission_rate: number | null
          price_per_night: number
          property_id: string
          review_rating: number | null
          review_text: string | null
          source: Database["public"]["Enums"]["booking_source"] | null
          status: Database["public"]["Enums"]["booking_status"] | null
          total_price: number
          updated_at: string
        }
        Insert: {
          access_code?: string | null
          actual_check_in?: string | null
          actual_check_out?: string | null
          agent_commission?: number | null
          agent_id: string
          channel_id?: string | null
          check_in: string
          check_out: string
          cleaning_fee?: number | null
          created_at?: string
          external_booking_id?: string | null
          guest_count?: number | null
          guest_country?: string | null
          guest_email?: string | null
          guest_name: string
          guest_notes?: string | null
          guest_phone?: string | null
          id?: string
          internal_notes?: string | null
          key_handover?: string | null
          net_to_owner?: number | null
          nights?: number | null
          owner_id?: string | null
          platform_commission?: number | null
          platform_commission_rate?: number | null
          price_per_night: number
          property_id: string
          review_rating?: number | null
          review_text?: string | null
          source?: Database["public"]["Enums"]["booking_source"] | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_price: number
          updated_at?: string
        }
        Update: {
          access_code?: string | null
          actual_check_in?: string | null
          actual_check_out?: string | null
          agent_commission?: number | null
          agent_id?: string
          channel_id?: string | null
          check_in?: string
          check_out?: string
          cleaning_fee?: number | null
          created_at?: string
          external_booking_id?: string | null
          guest_count?: number | null
          guest_country?: string | null
          guest_email?: string | null
          guest_name?: string
          guest_notes?: string | null
          guest_phone?: string | null
          id?: string
          internal_notes?: string | null
          key_handover?: string | null
          net_to_owner?: number | null
          nights?: number | null
          owner_id?: string | null
          platform_commission?: number | null
          platform_commission_rate?: number | null
          price_per_night?: number
          property_id?: string
          review_rating?: number | null
          review_text?: string | null
          source?: Database["public"]["Enums"]["booking_source"] | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "property_owners"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_blocks: {
        Row: {
          agent_id: string
          created_at: string
          end_date: string
          id: string
          notes: string | null
          property_id: string
          reason: string | null
          start_date: string
        }
        Insert: {
          agent_id: string
          created_at?: string
          end_date: string
          id?: string
          notes?: string | null
          property_id: string
          reason?: string | null
          start_date: string
        }
        Update: {
          agent_id?: string
          created_at?: string
          end_date?: string
          id?: string
          notes?: string | null
          property_id?: string
          reason?: string | null
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_blocks_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      channel_listings: {
        Row: {
          channel_id: string
          created_at: string
          external_listing_id: string | null
          external_url: string | null
          id: string
          last_error: string | null
          last_synced_at: string | null
          price_markup: number | null
          property_id: string
          status: Database["public"]["Enums"]["sync_status"] | null
          updated_at: string
        }
        Insert: {
          channel_id: string
          created_at?: string
          external_listing_id?: string | null
          external_url?: string | null
          id?: string
          last_error?: string | null
          last_synced_at?: string | null
          price_markup?: number | null
          property_id: string
          status?: Database["public"]["Enums"]["sync_status"] | null
          updated_at?: string
        }
        Update: {
          channel_id?: string
          created_at?: string
          external_listing_id?: string | null
          external_url?: string | null
          id?: string
          last_error?: string | null
          last_synced_at?: string | null
          price_markup?: number | null
          property_id?: string
          status?: Database["public"]["Enums"]["sync_status"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "channel_listings_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
        ]
      }
      channel_sync_log: {
        Row: {
          action: string
          channel_id: string
          created_at: string
          direction: Database["public"]["Enums"]["sync_direction"] | null
          duration_ms: number | null
          error_message: string | null
          id: string
          property_id: string | null
          request_data: Json | null
          response_data: Json | null
          status: string
        }
        Insert: {
          action: string
          channel_id: string
          created_at?: string
          direction?: Database["public"]["Enums"]["sync_direction"] | null
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          property_id?: string | null
          request_data?: Json | null
          response_data?: Json | null
          status: string
        }
        Update: {
          action?: string
          channel_id?: string
          created_at?: string
          direction?: Database["public"]["Enums"]["sync_direction"] | null
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          property_id?: string | null
          request_data?: Json | null
          response_data?: Json | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "channel_sync_log_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
        ]
      }
      channels: {
        Row: {
          access_token: string | null
          account_id: string | null
          agent_id: string
          api_key: string | null
          api_secret: string | null
          auto_sync: boolean | null
          channel_type: Database["public"]["Enums"]["channel_type"]
          created_at: string
          default_commission_rate: number | null
          id: string
          last_error: string | null
          last_sync_at: string | null
          refresh_token: string | null
          settings: Json | null
          status: Database["public"]["Enums"]["sync_status"] | null
          sync_direction: Database["public"]["Enums"]["sync_direction"] | null
          sync_interval_minutes: number | null
          token_expires_at: string | null
          updated_at: string
        }
        Insert: {
          access_token?: string | null
          account_id?: string | null
          agent_id: string
          api_key?: string | null
          api_secret?: string | null
          auto_sync?: boolean | null
          channel_type: Database["public"]["Enums"]["channel_type"]
          created_at?: string
          default_commission_rate?: number | null
          id?: string
          last_error?: string | null
          last_sync_at?: string | null
          refresh_token?: string | null
          settings?: Json | null
          status?: Database["public"]["Enums"]["sync_status"] | null
          sync_direction?: Database["public"]["Enums"]["sync_direction"] | null
          sync_interval_minutes?: number | null
          token_expires_at?: string | null
          updated_at?: string
        }
        Update: {
          access_token?: string | null
          account_id?: string | null
          agent_id?: string
          api_key?: string | null
          api_secret?: string | null
          auto_sync?: boolean | null
          channel_type?: Database["public"]["Enums"]["channel_type"]
          created_at?: string
          default_commission_rate?: number | null
          id?: string
          last_error?: string | null
          last_sync_at?: string | null
          refresh_token?: string | null
          settings?: Json | null
          status?: Database["public"]["Enums"]["sync_status"] | null
          sync_direction?: Database["public"]["Enums"]["sync_direction"] | null
          sync_interval_minutes?: number | null
          token_expires_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "channels_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      chatbot_configs: {
        Row: {
          agent_id: string
          auto_qualify_leads: boolean | null
          auto_schedule_viewings: boolean | null
          auto_send_properties: boolean | null
          business_hours_end: string | null
          business_hours_start: string | null
          created_at: string
          escalation_keywords: string[] | null
          id: string
          is_enabled: boolean | null
          languages: string[] | null
          personality: string | null
          timezone: string | null
          total_conversations: number | null
          total_leads_qualified: number | null
          total_viewings_scheduled: number | null
          updated_at: string
          welcome_message: Json | null
        }
        Insert: {
          agent_id: string
          auto_qualify_leads?: boolean | null
          auto_schedule_viewings?: boolean | null
          auto_send_properties?: boolean | null
          business_hours_end?: string | null
          business_hours_start?: string | null
          created_at?: string
          escalation_keywords?: string[] | null
          id?: string
          is_enabled?: boolean | null
          languages?: string[] | null
          personality?: string | null
          timezone?: string | null
          total_conversations?: number | null
          total_leads_qualified?: number | null
          total_viewings_scheduled?: number | null
          updated_at?: string
          welcome_message?: Json | null
        }
        Update: {
          agent_id?: string
          auto_qualify_leads?: boolean | null
          auto_schedule_viewings?: boolean | null
          auto_send_properties?: boolean | null
          business_hours_end?: string | null
          business_hours_start?: string | null
          created_at?: string
          escalation_keywords?: string[] | null
          id?: string
          is_enabled?: boolean | null
          languages?: string[] | null
          personality?: string | null
          timezone?: string | null
          total_conversations?: number | null
          total_leads_qualified?: number | null
          total_viewings_scheduled?: number | null
          updated_at?: string
          welcome_message?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "chatbot_configs_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      chatbot_sessions: {
        Row: {
          agent_id: string
          chatbot_config_id: string
          created_at: string
          detected_bedrooms: number | null
          detected_budget_max: number | null
          detected_budget_min: number | null
          detected_purpose: Database["public"]["Enums"]["buyer_purpose"] | null
          detected_zones: string[] | null
          duration_seconds: number | null
          ended_at: string | null
          escalated_to_agent: boolean | null
          id: string
          lead_created: boolean | null
          lead_id: string | null
          properties_interested: string[] | null
          properties_shown: string[] | null
          satisfaction_rating: number | null
          started_at: string
          total_messages: number | null
          viewing_scheduled: boolean | null
          visitor_country: string | null
          visitor_email: string | null
          visitor_language: string | null
          visitor_name: string | null
          visitor_phone: string | null
          visitor_session_id: string | null
        }
        Insert: {
          agent_id: string
          chatbot_config_id: string
          created_at?: string
          detected_bedrooms?: number | null
          detected_budget_max?: number | null
          detected_budget_min?: number | null
          detected_purpose?: Database["public"]["Enums"]["buyer_purpose"] | null
          detected_zones?: string[] | null
          duration_seconds?: number | null
          ended_at?: string | null
          escalated_to_agent?: boolean | null
          id?: string
          lead_created?: boolean | null
          lead_id?: string | null
          properties_interested?: string[] | null
          properties_shown?: string[] | null
          satisfaction_rating?: number | null
          started_at?: string
          total_messages?: number | null
          viewing_scheduled?: boolean | null
          visitor_country?: string | null
          visitor_email?: string | null
          visitor_language?: string | null
          visitor_name?: string | null
          visitor_phone?: string | null
          visitor_session_id?: string | null
        }
        Update: {
          agent_id?: string
          chatbot_config_id?: string
          created_at?: string
          detected_bedrooms?: number | null
          detected_budget_max?: number | null
          detected_budget_min?: number | null
          detected_purpose?: Database["public"]["Enums"]["buyer_purpose"] | null
          detected_zones?: string[] | null
          duration_seconds?: number | null
          ended_at?: string | null
          escalated_to_agent?: boolean | null
          id?: string
          lead_created?: boolean | null
          lead_id?: string | null
          properties_interested?: string[] | null
          properties_shown?: string[] | null
          satisfaction_rating?: number | null
          started_at?: string
          total_messages?: number | null
          viewing_scheduled?: boolean | null
          visitor_country?: string | null
          visitor_email?: string | null
          visitor_language?: string | null
          visitor_name?: string | null
          visitor_phone?: string | null
          visitor_session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chatbot_sessions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chatbot_sessions_chatbot_config_id_fkey"
            columns: ["chatbot_config_id"]
            isOneToOne: false
            referencedRelation: "chatbot_configs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chatbot_sessions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      cleanings: {
        Row: {
          agent_id: string
          booking_id: string | null
          checklist: Json | null
          cleaner_name: string | null
          cleaner_phone: string | null
          completed_at: string | null
          cost: number | null
          created_at: string
          duration_minutes: number | null
          id: string
          issues_reported: string | null
          paid_by: string | null
          photos: string[] | null
          property_id: string
          scheduled_date: string
          scheduled_time: string | null
          status: Database["public"]["Enums"]["cleaning_status"] | null
          type: string | null
          updated_at: string
        }
        Insert: {
          agent_id: string
          booking_id?: string | null
          checklist?: Json | null
          cleaner_name?: string | null
          cleaner_phone?: string | null
          completed_at?: string | null
          cost?: number | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          issues_reported?: string | null
          paid_by?: string | null
          photos?: string[] | null
          property_id: string
          scheduled_date: string
          scheduled_time?: string | null
          status?: Database["public"]["Enums"]["cleaning_status"] | null
          type?: string | null
          updated_at?: string
        }
        Update: {
          agent_id?: string
          booking_id?: string | null
          checklist?: Json | null
          cleaner_name?: string | null
          cleaner_phone?: string | null
          completed_at?: string | null
          cost?: number | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          issues_reported?: string | null
          paid_by?: string | null
          photos?: string[] | null
          property_id?: string
          scheduled_date?: string
          scheduled_time?: string | null
          status?: Database["public"]["Enums"]["cleaning_status"] | null
          type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cleanings_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cleanings_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      content_translations: {
        Row: {
          agent_id: string
          created_at: string | null
          id: string
          source_field: string
          source_id: string
          source_language: string
          source_table: string
          status: string
          target_language: string
          translated_text: string
          updated_at: string | null
        }
        Insert: {
          agent_id: string
          created_at?: string | null
          id?: string
          source_field: string
          source_id: string
          source_language?: string
          source_table: string
          status?: string
          target_language: string
          translated_text: string
          updated_at?: string | null
        }
        Update: {
          agent_id?: string
          created_at?: string | null
          id?: string
          source_field?: string
          source_id?: string
          source_language?: string
          source_table?: string
          status?: string
          target_language?: string
          translated_text?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_translations_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agent_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          agent_id: string
          auto_reply_enabled: boolean | null
          booking_id: string | null
          contact_channel: Database["public"]["Enums"]["message_channel"]
          contact_email: string | null
          contact_name: string
          contact_phone: string | null
          created_at: string
          external_conversation_id: string | null
          id: string
          is_archived: boolean | null
          is_starred: boolean | null
          is_unread: boolean | null
          last_message_at: string | null
          last_message_preview: string | null
          lead_id: string | null
          property_id: string | null
          tags: string[] | null
          unread_count: number | null
          updated_at: string
        }
        Insert: {
          agent_id: string
          auto_reply_enabled?: boolean | null
          booking_id?: string | null
          contact_channel: Database["public"]["Enums"]["message_channel"]
          contact_email?: string | null
          contact_name: string
          contact_phone?: string | null
          created_at?: string
          external_conversation_id?: string | null
          id?: string
          is_archived?: boolean | null
          is_starred?: boolean | null
          is_unread?: boolean | null
          last_message_at?: string | null
          last_message_preview?: string | null
          lead_id?: string | null
          property_id?: string | null
          tags?: string[] | null
          unread_count?: number | null
          updated_at?: string
        }
        Update: {
          agent_id?: string
          auto_reply_enabled?: boolean | null
          booking_id?: string | null
          contact_channel?: Database["public"]["Enums"]["message_channel"]
          contact_email?: string | null
          contact_name?: string
          contact_phone?: string | null
          created_at?: string
          external_conversation_id?: string | null
          id?: string
          is_archived?: boolean | null
          is_starred?: boolean | null
          is_unread?: boolean | null
          last_message_at?: string | null
          last_message_preview?: string | null
          lead_id?: string | null
          property_id?: string | null
          tags?: string[] | null
          unread_count?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      dynamic_pricing_config: {
        Row: {
          agent_id: string
          base_price: number
          comp_property_urls: string[] | null
          comp_tracking_enabled: boolean | null
          created_at: string
          early_bird_discount: number | null
          gap_night_discount: number | null
          high_demand_multiplier: number | null
          id: string
          is_enabled: boolean | null
          last_minute_discount: number | null
          last_price_update_at: string | null
          local_events_enabled: boolean | null
          long_stay_discount_30: number | null
          long_stay_discount_7: number | null
          max_price: number
          min_price: number
          property_id: string
          target_occupancy: number | null
          updated_at: string
          weekend_multiplier: number | null
        }
        Insert: {
          agent_id: string
          base_price: number
          comp_property_urls?: string[] | null
          comp_tracking_enabled?: boolean | null
          created_at?: string
          early_bird_discount?: number | null
          gap_night_discount?: number | null
          high_demand_multiplier?: number | null
          id?: string
          is_enabled?: boolean | null
          last_minute_discount?: number | null
          last_price_update_at?: string | null
          local_events_enabled?: boolean | null
          long_stay_discount_30?: number | null
          long_stay_discount_7?: number | null
          max_price: number
          min_price: number
          property_id: string
          target_occupancy?: number | null
          updated_at?: string
          weekend_multiplier?: number | null
        }
        Update: {
          agent_id?: string
          base_price?: number
          comp_property_urls?: string[] | null
          comp_tracking_enabled?: boolean | null
          created_at?: string
          early_bird_discount?: number | null
          gap_night_discount?: number | null
          high_demand_multiplier?: number | null
          id?: string
          is_enabled?: boolean | null
          last_minute_discount?: number | null
          last_price_update_at?: string | null
          local_events_enabled?: boolean | null
          long_stay_discount_30?: number | null
          long_stay_discount_7?: number | null
          max_price?: number
          min_price?: number
          property_id?: string
          target_occupancy?: number | null
          updated_at?: string
          weekend_multiplier?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "dynamic_pricing_config_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      email_campaigns: {
        Row: {
          agent_id: string
          body_html: Json
          click_rate: number | null
          created_at: string
          featured_property_ids: string[] | null
          id: string
          name: string
          open_rate: number | null
          preview_text: string | null
          scheduled_at: string | null
          segment_id: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["campaign_status"] | null
          subject: Json
          tags: string[] | null
          template_id: string | null
          total_bounced: number | null
          total_clicked: number | null
          total_delivered: number | null
          total_opened: number | null
          total_recipients: number | null
          total_sent: number | null
          total_unsubscribed: number | null
          updated_at: string
        }
        Insert: {
          agent_id: string
          body_html?: Json
          click_rate?: number | null
          created_at?: string
          featured_property_ids?: string[] | null
          id?: string
          name: string
          open_rate?: number | null
          preview_text?: string | null
          scheduled_at?: string | null
          segment_id?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["campaign_status"] | null
          subject?: Json
          tags?: string[] | null
          template_id?: string | null
          total_bounced?: number | null
          total_clicked?: number | null
          total_delivered?: number | null
          total_opened?: number | null
          total_recipients?: number | null
          total_sent?: number | null
          total_unsubscribed?: number | null
          updated_at?: string
        }
        Update: {
          agent_id?: string
          body_html?: Json
          click_rate?: number | null
          created_at?: string
          featured_property_ids?: string[] | null
          id?: string
          name?: string
          open_rate?: number | null
          preview_text?: string | null
          scheduled_at?: string | null
          segment_id?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["campaign_status"] | null
          subject?: Json
          tags?: string[] | null
          template_id?: string | null
          total_bounced?: number | null
          total_clicked?: number | null
          total_delivered?: number | null
          total_opened?: number | null
          total_recipients?: number | null
          total_sent?: number | null
          total_unsubscribed?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_campaigns_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_campaigns_segment_id_fkey"
            columns: ["segment_id"]
            isOneToOne: false
            referencedRelation: "email_segments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_campaigns_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      email_events: {
        Row: {
          campaign_id: string
          created_at: string
          email_address: string
          event_type: Database["public"]["Enums"]["email_event_type"]
          id: string
          ip_address: unknown
          lead_id: string
          link_url: string | null
          metadata: Json | null
          property_id: string | null
          user_agent: string | null
        }
        Insert: {
          campaign_id: string
          created_at?: string
          email_address: string
          event_type: Database["public"]["Enums"]["email_event_type"]
          id?: string
          ip_address?: unknown
          lead_id: string
          link_url?: string | null
          metadata?: Json | null
          property_id?: string | null
          user_agent?: string | null
        }
        Update: {
          campaign_id?: string
          created_at?: string
          email_address?: string
          event_type?: Database["public"]["Enums"]["email_event_type"]
          id?: string
          ip_address?: unknown
          lead_id?: string
          link_url?: string | null
          metadata?: Json | null
          property_id?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_events_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaign_performance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_events_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "email_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      email_segments: {
        Row: {
          agent_id: string
          created_at: string
          description: string | null
          estimated_size: number | null
          filter_bedrooms_min: number | null
          filter_has_features: string[] | null
          filter_languages: string[] | null
          filter_lead_status:
            | Database["public"]["Enums"]["lead_status"][]
            | null
          filter_municipalities: string[] | null
          filter_nationalities: string[] | null
          filter_operations:
            | Database["public"]["Enums"]["property_operation"][]
            | null
          filter_price_max: number | null
          filter_price_min: number | null
          filter_purpose: Database["public"]["Enums"]["buyer_purpose"][] | null
          filter_searched_recently: boolean | null
          filter_tags: string[] | null
          filter_timeline:
            | Database["public"]["Enums"]["buyer_timeline"][]
            | null
          filter_viewed_similar: boolean | null
          filter_zones: string[] | null
          id: string
          is_dynamic: boolean | null
          last_calculated_at: string | null
          name: string
          updated_at: string
        }
        Insert: {
          agent_id: string
          created_at?: string
          description?: string | null
          estimated_size?: number | null
          filter_bedrooms_min?: number | null
          filter_has_features?: string[] | null
          filter_languages?: string[] | null
          filter_lead_status?:
            | Database["public"]["Enums"]["lead_status"][]
            | null
          filter_municipalities?: string[] | null
          filter_nationalities?: string[] | null
          filter_operations?:
            | Database["public"]["Enums"]["property_operation"][]
            | null
          filter_price_max?: number | null
          filter_price_min?: number | null
          filter_purpose?: Database["public"]["Enums"]["buyer_purpose"][] | null
          filter_searched_recently?: boolean | null
          filter_tags?: string[] | null
          filter_timeline?:
            | Database["public"]["Enums"]["buyer_timeline"][]
            | null
          filter_viewed_similar?: boolean | null
          filter_zones?: string[] | null
          id?: string
          is_dynamic?: boolean | null
          last_calculated_at?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          agent_id?: string
          created_at?: string
          description?: string | null
          estimated_size?: number | null
          filter_bedrooms_min?: number | null
          filter_has_features?: string[] | null
          filter_languages?: string[] | null
          filter_lead_status?:
            | Database["public"]["Enums"]["lead_status"][]
            | null
          filter_municipalities?: string[] | null
          filter_nationalities?: string[] | null
          filter_operations?:
            | Database["public"]["Enums"]["property_operation"][]
            | null
          filter_price_max?: number | null
          filter_price_min?: number | null
          filter_purpose?: Database["public"]["Enums"]["buyer_purpose"][] | null
          filter_searched_recently?: boolean | null
          filter_tags?: string[] | null
          filter_timeline?:
            | Database["public"]["Enums"]["buyer_timeline"][]
            | null
          filter_viewed_similar?: boolean | null
          filter_zones?: string[] | null
          id?: string
          is_dynamic?: boolean | null
          last_calculated_at?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_segments_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          agent_id: string | null
          body_html: Json
          body_text: Json | null
          category: string | null
          created_at: string
          id: string
          is_system: boolean | null
          name: string
          subject: Json
          thumbnail_url: string | null
          updated_at: string
          variables: string[] | null
        }
        Insert: {
          agent_id?: string | null
          body_html?: Json
          body_text?: Json | null
          category?: string | null
          created_at?: string
          id?: string
          is_system?: boolean | null
          name: string
          subject?: Json
          thumbnail_url?: string | null
          updated_at?: string
          variables?: string[] | null
        }
        Update: {
          agent_id?: string | null
          body_html?: Json
          body_text?: Json | null
          category?: string | null
          created_at?: string
          id?: string
          is_system?: boolean | null
          name?: string
          subject?: Json
          thumbnail_url?: string | null
          updated_at?: string
          variables?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "email_templates_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          property_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          property_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          property_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_transactions: {
        Row: {
          agent_id: string
          amount: number
          booking_id: string | null
          category: string
          counterpart_name: string | null
          counterpart_tax_id: string | null
          counterpart_type: string | null
          created_at: string
          description: string | null
          fiscal_year: number | null
          id: string
          igic_amount: number | null
          igic_rate: number | null
          invoice_date: string | null
          invoice_due_date: string | null
          invoice_number: string | null
          invoice_paid_date: string | null
          invoice_status: Database["public"]["Enums"]["invoice_status"] | null
          is_recurring: boolean | null
          mls_transaction_id: string | null
          notes: string | null
          property_id: string | null
          quarter: string | null
          receipt_url: string | null
          recurring_period: string | null
          subcategory: string | null
          tags: string[] | null
          tax_deductible: boolean | null
          total_amount: number
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string
        }
        Insert: {
          agent_id: string
          amount: number
          booking_id?: string | null
          category: string
          counterpart_name?: string | null
          counterpart_tax_id?: string | null
          counterpart_type?: string | null
          created_at?: string
          description?: string | null
          fiscal_year?: number | null
          id?: string
          igic_amount?: number | null
          igic_rate?: number | null
          invoice_date?: string | null
          invoice_due_date?: string | null
          invoice_number?: string | null
          invoice_paid_date?: string | null
          invoice_status?: Database["public"]["Enums"]["invoice_status"] | null
          is_recurring?: boolean | null
          mls_transaction_id?: string | null
          notes?: string | null
          property_id?: string | null
          quarter?: string | null
          receipt_url?: string | null
          recurring_period?: string | null
          subcategory?: string | null
          tags?: string[] | null
          tax_deductible?: boolean | null
          total_amount: number
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
        }
        Update: {
          agent_id?: string
          amount?: number
          booking_id?: string | null
          category?: string
          counterpart_name?: string | null
          counterpart_tax_id?: string | null
          counterpart_type?: string | null
          created_at?: string
          description?: string | null
          fiscal_year?: number | null
          id?: string
          igic_amount?: number | null
          igic_rate?: number | null
          invoice_date?: string | null
          invoice_due_date?: string | null
          invoice_number?: string | null
          invoice_paid_date?: string | null
          invoice_status?: Database["public"]["Enums"]["invoice_status"] | null
          is_recurring?: boolean | null
          mls_transaction_id?: string | null
          notes?: string | null
          property_id?: string | null
          quarter?: string | null
          receipt_url?: string | null
          recurring_period?: string | null
          subcategory?: string | null
          tags?: string[] | null
          tax_deductible?: boolean | null
          total_amount?: number
          type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_transactions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_mls_transaction_id_fkey"
            columns: ["mls_transaction_id"]
            isOneToOne: false
            referencedRelation: "mls_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_images: {
        Row: {
          agent_id: string
          caption: string | null
          created_at: string | null
          display_order: number | null
          id: string
          image_url: string
          updated_at: string | null
        }
        Insert: {
          agent_id: string
          caption?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url: string
          updated_at?: string | null
        }
        Update: {
          agent_id?: string
          caption?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gallery_images_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agent_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      guest_verifications: {
        Row: {
          agent_id: string
          booking_id: string
          created_at: string
          guest_email: string | null
          guest_name: string
          guest_phone: string | null
          id: string
          id_country: string | null
          id_expiry: string | null
          id_number_hash: string | null
          id_photo_url: string | null
          id_type: string | null
          ip_address: unknown
          link_expires_at: string | null
          rejected_reason: string | null
          selfie_url: string | null
          status: Database["public"]["Enums"]["verification_status"] | null
          updated_at: string
          verification_link: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          agent_id: string
          booking_id: string
          created_at?: string
          guest_email?: string | null
          guest_name: string
          guest_phone?: string | null
          id?: string
          id_country?: string | null
          id_expiry?: string | null
          id_number_hash?: string | null
          id_photo_url?: string | null
          id_type?: string | null
          ip_address?: unknown
          link_expires_at?: string | null
          rejected_reason?: string | null
          selfie_url?: string | null
          status?: Database["public"]["Enums"]["verification_status"] | null
          updated_at?: string
          verification_link?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          agent_id?: string
          booking_id?: string
          created_at?: string
          guest_email?: string | null
          guest_name?: string
          guest_phone?: string | null
          id?: string
          id_country?: string | null
          id_expiry?: string | null
          id_number_hash?: string | null
          id_photo_url?: string | null
          id_type?: string | null
          ip_address?: unknown
          link_expires_at?: string | null
          rejected_reason?: string | null
          selfie_url?: string | null
          status?: Database["public"]["Enums"]["verification_status"] | null
          updated_at?: string
          verification_link?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guest_verifications_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guest_verifications_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      guidebooks: {
        Row: {
          activities: Json | null
          agent_id: string
          appliance_guides: Json | null
          beaches: Json | null
          check_in_instructions: Json | null
          check_out_instructions: Json | null
          cover_photo_url: string | null
          created_at: string
          custom_branding: boolean | null
          emergency_contacts: Json | null
          house_rules: Json | null
          id: string
          is_published: boolean | null
          last_updated_by: string | null
          parking_instructions: Json | null
          property_id: string
          qr_code_url: string | null
          recommended_professional_ids: string[] | null
          restaurants: Json | null
          shops: Json | null
          slug: string | null
          total_views: number | null
          transport: Json | null
          updated_at: string
          welcome_message: Json | null
          wifi_name: string | null
          wifi_password: string | null
        }
        Insert: {
          activities?: Json | null
          agent_id: string
          appliance_guides?: Json | null
          beaches?: Json | null
          check_in_instructions?: Json | null
          check_out_instructions?: Json | null
          cover_photo_url?: string | null
          created_at?: string
          custom_branding?: boolean | null
          emergency_contacts?: Json | null
          house_rules?: Json | null
          id?: string
          is_published?: boolean | null
          last_updated_by?: string | null
          parking_instructions?: Json | null
          property_id: string
          qr_code_url?: string | null
          recommended_professional_ids?: string[] | null
          restaurants?: Json | null
          shops?: Json | null
          slug?: string | null
          total_views?: number | null
          transport?: Json | null
          updated_at?: string
          welcome_message?: Json | null
          wifi_name?: string | null
          wifi_password?: string | null
        }
        Update: {
          activities?: Json | null
          agent_id?: string
          appliance_guides?: Json | null
          beaches?: Json | null
          check_in_instructions?: Json | null
          check_out_instructions?: Json | null
          cover_photo_url?: string | null
          created_at?: string
          custom_branding?: boolean | null
          emergency_contacts?: Json | null
          house_rules?: Json | null
          id?: string
          is_published?: boolean | null
          last_updated_by?: string | null
          parking_instructions?: Json | null
          property_id?: string
          qr_code_url?: string | null
          recommended_professional_ids?: string[] | null
          restaurants?: Json | null
          shops?: Json | null
          slug?: string | null
          total_views?: number | null
          transport?: Json | null
          updated_at?: string
          welcome_message?: Json | null
          wifi_name?: string | null
          wifi_password?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guidebooks_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guidebooks_last_updated_by_fkey"
            columns: ["last_updated_by"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      hero_config: {
        Row: {
          agent_id: string
          background_image_url: string | null
          created_at: string | null
          cta_link: string | null
          cta_text: string | null
          headline: string
          id: string
          overlay_opacity: number | null
          subtitle: string | null
          updated_at: string | null
        }
        Insert: {
          agent_id: string
          background_image_url?: string | null
          created_at?: string | null
          cta_link?: string | null
          cta_text?: string | null
          headline: string
          id?: string
          overlay_opacity?: number | null
          subtitle?: string | null
          updated_at?: string | null
        }
        Update: {
          agent_id?: string
          background_image_url?: string | null
          created_at?: string | null
          cta_link?: string | null
          cta_text?: string | null
          headline?: string
          id?: string
          overlay_opacity?: number | null
          subtitle?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hero_config_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: true
            referencedRelation: "agent_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_items: {
        Row: {
          agent_id: string
          category: string
          condition: Database["public"]["Enums"]["inventory_condition"] | null
          created_at: string
          id: string
          last_checked_at: string | null
          name: string
          needs_replacement: boolean | null
          notes: string | null
          property_id: string
          purchase_cost: number | null
          purchase_date: string | null
          quantity: number
          replacement_cost: number | null
          updated_at: string
        }
        Insert: {
          agent_id: string
          category: string
          condition?: Database["public"]["Enums"]["inventory_condition"] | null
          created_at?: string
          id?: string
          last_checked_at?: string | null
          name: string
          needs_replacement?: boolean | null
          notes?: string | null
          property_id: string
          purchase_cost?: number | null
          purchase_date?: string | null
          quantity?: number
          replacement_cost?: number | null
          updated_at?: string
        }
        Update: {
          agent_id?: string
          category?: string
          condition?: Database["public"]["Enums"]["inventory_condition"] | null
          created_at?: string
          id?: string
          last_checked_at?: string | null
          name?: string
          needs_replacement?: boolean | null
          notes?: string | null
          property_id?: string
          purchase_cost?: number | null
          purchase_date?: string | null
          quantity?: number
          replacement_cost?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_activities: {
        Row: {
          activity_type: string
          agent_id: string | null
          completed_at: string | null
          created_at: string
          description: string | null
          id: string
          lead_id: string
          metadata: Json | null
          scheduled_at: string | null
          title: string | null
        }
        Insert: {
          activity_type: string
          agent_id?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          lead_id: string
          metadata?: Json | null
          scheduled_at?: string | null
          title?: string | null
        }
        Update: {
          activity_type?: string
          agent_id?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          lead_id?: string
          metadata?: Json | null
          scheduled_at?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_activities_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          agency_id: string | null
          agent_id: string | null
          area_max: number | null
          area_min: number | null
          bathrooms_min: number | null
          bedrooms_max: number | null
          bedrooms_min: number | null
          budget_max: number | null
          budget_min: number | null
          converted_at: string | null
          country: string | null
          created_at: string
          email: string | null
          email_subscribed: boolean | null
          email_unsubscribed_at: string | null
          financing_needed: boolean | null
          full_name: string
          id: string
          is_archived: boolean | null
          is_deleted: boolean | null
          is_hot: boolean | null
          last_contacted_at: string | null
          must_have_features: string[] | null
          nationality: string | null
          next_follow_up_at: string | null
          nice_to_have_features: string[] | null
          notes: string | null
          phone: string | null
          pre_approved: boolean | null
          preferred_language: string | null
          preferred_municipalities: string[] | null
          preferred_operations:
            | Database["public"]["Enums"]["property_operation"][]
            | null
          preferred_zones: string[] | null
          property_id: string | null
          purpose: Database["public"]["Enums"]["buyer_purpose"] | null
          score: number | null
          source: Database["public"]["Enums"]["lead_source"] | null
          source_detail: string | null
          status: Database["public"]["Enums"]["lead_status"] | null
          tags: string[] | null
          timeline: Database["public"]["Enums"]["buyer_timeline"] | null
          total_interactions: number | null
          total_viewings: number | null
          updated_at: string
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
          whatsapp: string | null
        }
        Insert: {
          agency_id?: string | null
          agent_id?: string | null
          area_max?: number | null
          area_min?: number | null
          bathrooms_min?: number | null
          bedrooms_max?: number | null
          bedrooms_min?: number | null
          budget_max?: number | null
          budget_min?: number | null
          converted_at?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          email_subscribed?: boolean | null
          email_unsubscribed_at?: string | null
          financing_needed?: boolean | null
          full_name: string
          id?: string
          is_archived?: boolean | null
          is_deleted?: boolean | null
          is_hot?: boolean | null
          last_contacted_at?: string | null
          must_have_features?: string[] | null
          nationality?: string | null
          next_follow_up_at?: string | null
          nice_to_have_features?: string[] | null
          notes?: string | null
          phone?: string | null
          pre_approved?: boolean | null
          preferred_language?: string | null
          preferred_municipalities?: string[] | null
          preferred_operations?:
            | Database["public"]["Enums"]["property_operation"][]
            | null
          preferred_zones?: string[] | null
          property_id?: string | null
          purpose?: Database["public"]["Enums"]["buyer_purpose"] | null
          score?: number | null
          source?: Database["public"]["Enums"]["lead_source"] | null
          source_detail?: string | null
          status?: Database["public"]["Enums"]["lead_status"] | null
          tags?: string[] | null
          timeline?: Database["public"]["Enums"]["buyer_timeline"] | null
          total_interactions?: number | null
          total_viewings?: number | null
          updated_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          whatsapp?: string | null
        }
        Update: {
          agency_id?: string | null
          agent_id?: string | null
          area_max?: number | null
          area_min?: number | null
          bathrooms_min?: number | null
          bedrooms_max?: number | null
          bedrooms_min?: number | null
          budget_max?: number | null
          budget_min?: number | null
          converted_at?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          email_subscribed?: boolean | null
          email_unsubscribed_at?: string | null
          financing_needed?: boolean | null
          full_name?: string
          id?: string
          is_archived?: boolean | null
          is_deleted?: boolean | null
          is_hot?: boolean | null
          last_contacted_at?: string | null
          must_have_features?: string[] | null
          nationality?: string | null
          next_follow_up_at?: string | null
          nice_to_have_features?: string[] | null
          notes?: string | null
          phone?: string | null
          pre_approved?: boolean | null
          preferred_language?: string | null
          preferred_municipalities?: string[] | null
          preferred_operations?:
            | Database["public"]["Enums"]["property_operation"][]
            | null
          preferred_zones?: string[] | null
          property_id?: string | null
          purpose?: Database["public"]["Enums"]["buyer_purpose"] | null
          score?: number | null
          source?: Database["public"]["Enums"]["lead_source"] | null
          source_detail?: string | null
          status?: Database["public"]["Enums"]["lead_status"] | null
          tags?: string[] | null
          timeline?: Database["public"]["Enums"]["buyer_timeline"] | null
          total_interactions?: number | null
          total_viewings?: number | null
          updated_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      local_events: {
        Row: {
          created_at: string
          description: string | null
          end_date: string
          id: string
          impact_radius_km: number | null
          is_recurring: boolean | null
          municipality: string | null
          name: string
          price_multiplier: number | null
          region: string | null
          source: string | null
          start_date: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date: string
          id?: string
          impact_radius_km?: number | null
          is_recurring?: boolean | null
          municipality?: string | null
          name: string
          price_multiplier?: number | null
          region?: string | null
          source?: string | null
          start_date: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string
          id?: string
          impact_radius_km?: number | null
          is_recurring?: boolean | null
          municipality?: string | null
          name?: string
          price_multiplier?: number | null
          region?: string | null
          source?: string | null
          start_date?: string
        }
        Relationships: []
      }
      message_templates: {
        Row: {
          agent_id: string | null
          available_variables: string[] | null
          body: Json
          channel: Database["public"]["Enums"]["message_channel"] | null
          created_at: string
          delay_minutes: number | null
          id: string
          is_active: boolean | null
          is_system: boolean | null
          name: string
          send_time: string | null
          sort_order: number | null
          subject: Json | null
          trigger_event: Database["public"]["Enums"]["auto_message_trigger"]
          updated_at: string
        }
        Insert: {
          agent_id?: string | null
          available_variables?: string[] | null
          body?: Json
          channel?: Database["public"]["Enums"]["message_channel"] | null
          created_at?: string
          delay_minutes?: number | null
          id?: string
          is_active?: boolean | null
          is_system?: boolean | null
          name: string
          send_time?: string | null
          sort_order?: number | null
          subject?: Json | null
          trigger_event: Database["public"]["Enums"]["auto_message_trigger"]
          updated_at?: string
        }
        Update: {
          agent_id?: string | null
          available_variables?: string[] | null
          body?: Json
          channel?: Database["public"]["Enums"]["message_channel"] | null
          created_at?: string
          delay_minutes?: number | null
          id?: string
          is_active?: boolean | null
          is_system?: boolean | null
          name?: string
          send_time?: string | null
          sort_order?: number | null
          subject?: Json | null
          trigger_event?: Database["public"]["Enums"]["auto_message_trigger"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_templates_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          agent_id: string
          ai_generated: boolean | null
          ai_language: string | null
          ai_sentiment: string | null
          ai_suggested_response: string | null
          attachments: Json | null
          body: string
          body_html: string | null
          channel: Database["public"]["Enums"]["message_channel"]
          conversation_id: string
          created_at: string
          delivered_at: string | null
          direction: Database["public"]["Enums"]["message_direction"]
          error_message: string | null
          external_message_id: string | null
          id: string
          read_at: string | null
          status: Database["public"]["Enums"]["message_status"] | null
        }
        Insert: {
          agent_id: string
          ai_generated?: boolean | null
          ai_language?: string | null
          ai_sentiment?: string | null
          ai_suggested_response?: string | null
          attachments?: Json | null
          body: string
          body_html?: string | null
          channel: Database["public"]["Enums"]["message_channel"]
          conversation_id: string
          created_at?: string
          delivered_at?: string | null
          direction: Database["public"]["Enums"]["message_direction"]
          error_message?: string | null
          external_message_id?: string | null
          id?: string
          read_at?: string | null
          status?: Database["public"]["Enums"]["message_status"] | null
        }
        Update: {
          agent_id?: string
          ai_generated?: boolean | null
          ai_language?: string | null
          ai_sentiment?: string | null
          ai_suggested_response?: string | null
          attachments?: Json | null
          body?: string
          body_html?: string | null
          channel?: Database["public"]["Enums"]["message_channel"]
          conversation_id?: string
          created_at?: string
          delivered_at?: string | null
          direction?: Database["public"]["Enums"]["message_direction"]
          error_message?: string | null
          external_message_id?: string | null
          id?: string
          read_at?: string | null
          status?: Database["public"]["Enums"]["message_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      mls_listings: {
        Row: {
          active: boolean | null
          commission_split: number
          commission_total: number
          created_at: string
          expires_at: string | null
          id: string
          is_exclusive: boolean | null
          listing_agent_id: string
          notes: string | null
          property_id: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          commission_split?: number
          commission_total: number
          created_at?: string
          expires_at?: string | null
          id?: string
          is_exclusive?: boolean | null
          listing_agent_id: string
          notes?: string | null
          property_id: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          commission_split?: number
          commission_total?: number
          created_at?: string
          expires_at?: string | null
          id?: string
          is_exclusive?: boolean | null
          listing_agent_id?: string
          notes?: string | null
          property_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mls_listings_listing_agent_id_fkey"
            columns: ["listing_agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      mls_transactions: {
        Row: {
          commission_listing_agent: number
          commission_selling_agent: number
          commission_total: number
          completed_at: string | null
          created_at: string
          id: string
          listing_agent_id: string
          mls_listing_id: string | null
          notes: string | null
          platform_fee: number
          platform_fee_rate: number | null
          property_id: string
          sale_price: number
          selling_agent_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          commission_listing_agent: number
          commission_selling_agent: number
          commission_total: number
          completed_at?: string | null
          created_at?: string
          id?: string
          listing_agent_id: string
          mls_listing_id?: string | null
          notes?: string | null
          platform_fee: number
          platform_fee_rate?: number | null
          property_id: string
          sale_price: number
          selling_agent_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          commission_listing_agent?: number
          commission_selling_agent?: number
          commission_total?: number
          completed_at?: string | null
          created_at?: string
          id?: string
          listing_agent_id?: string
          mls_listing_id?: string | null
          notes?: string | null
          platform_fee?: number
          platform_fee_rate?: number | null
          property_id?: string
          sale_price?: number
          selling_agent_id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mls_transactions_listing_agent_id_fkey"
            columns: ["listing_agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mls_transactions_mls_listing_id_fkey"
            columns: ["mls_listing_id"]
            isOneToOne: false
            referencedRelation: "mls_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mls_transactions_selling_agent_id_fkey"
            columns: ["selling_agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      module_definitions: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          features: Json | null
          id: string
          is_active: boolean | null
          name: string
          price_monthly: number
          slug: string
          sort_order: number | null
          stripe_price_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          price_monthly?: number
          slug: string
          sort_order?: number | null
          stripe_price_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          price_monthly?: number
          slug?: string
          sort_order?: number | null
          stripe_price_id?: string | null
        }
        Relationships: []
      }
      module_usage: {
        Row: {
          agent_id: string
          created_at: string | null
          id: string
          metadata: Json | null
          module_slug: string
          quantity: number | null
          usage_type: string
        }
        Insert: {
          agent_id: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          module_slug: string
          quantity?: number | null
          usage_type: string
        }
        Update: {
          agent_id?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          module_slug?: string
          quantity?: number | null
          usage_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "module_usage_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agent_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          is_read: boolean | null
          link: string | null
          message: string | null
          read_at: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          message?: string | null
          read_at?: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          message?: string | null
          read_at?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      offices: {
        Row: {
          address: string
          agent_count: number | null
          agent_id: string
          created_at: string | null
          email: string | null
          hours: string | null
          id: string
          is_active: boolean | null
          is_main: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          phone: string | null
          property_count: number | null
          updated_at: string | null
        }
        Insert: {
          address: string
          agent_count?: number | null
          agent_id: string
          created_at?: string | null
          email?: string | null
          hours?: string | null
          id?: string
          is_active?: boolean | null
          is_main?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          phone?: string | null
          property_count?: number | null
          updated_at?: string | null
        }
        Update: {
          address?: string
          agent_count?: number | null
          agent_id?: string
          created_at?: string | null
          email?: string | null
          hours?: string | null
          id?: string
          is_active?: boolean | null
          is_main?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          phone?: string | null
          property_count?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "offices_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agent_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      owner_reports: {
        Row: {
          agent_commission_amount: number | null
          agent_commission_rate: number
          agent_id: string
          cleaning_costs_owner: number | null
          created_at: string
          gross_income: number | null
          id: string
          igic_amount: number | null
          igic_applicable: boolean | null
          insurance_costs_owner: number | null
          internal_notes: string | null
          laundry_costs_owner: number | null
          maintenance_costs_owner: number | null
          net_rental_income: number | null
          net_to_owner: number | null
          notes_to_owner: string | null
          occupancy_rate: number | null
          other_costs_owner: number | null
          owner_acknowledged_at: string | null
          owner_id: string
          pdf_generated_at: string | null
          pdf_url: string | null
          period_end: string
          period_start: string
          platform_fees: number | null
          property_id: string
          report_type: string
          sent_at: string | null
          sent_to_email: string | null
          status: string | null
          supplies_costs_owner: number | null
          total_bookings: number | null
          total_costs_owner: number | null
          total_nights_booked: number | null
          updated_at: string
          utilities_costs_owner: number | null
        }
        Insert: {
          agent_commission_amount?: number | null
          agent_commission_rate: number
          agent_id: string
          cleaning_costs_owner?: number | null
          created_at?: string
          gross_income?: number | null
          id?: string
          igic_amount?: number | null
          igic_applicable?: boolean | null
          insurance_costs_owner?: number | null
          internal_notes?: string | null
          laundry_costs_owner?: number | null
          maintenance_costs_owner?: number | null
          net_rental_income?: number | null
          net_to_owner?: number | null
          notes_to_owner?: string | null
          occupancy_rate?: number | null
          other_costs_owner?: number | null
          owner_acknowledged_at?: string | null
          owner_id: string
          pdf_generated_at?: string | null
          pdf_url?: string | null
          period_end: string
          period_start: string
          platform_fees?: number | null
          property_id: string
          report_type?: string
          sent_at?: string | null
          sent_to_email?: string | null
          status?: string | null
          supplies_costs_owner?: number | null
          total_bookings?: number | null
          total_costs_owner?: number | null
          total_nights_booked?: number | null
          updated_at?: string
          utilities_costs_owner?: number | null
        }
        Update: {
          agent_commission_amount?: number | null
          agent_commission_rate?: number
          agent_id?: string
          cleaning_costs_owner?: number | null
          created_at?: string
          gross_income?: number | null
          id?: string
          igic_amount?: number | null
          igic_applicable?: boolean | null
          insurance_costs_owner?: number | null
          internal_notes?: string | null
          laundry_costs_owner?: number | null
          maintenance_costs_owner?: number | null
          net_rental_income?: number | null
          net_to_owner?: number | null
          notes_to_owner?: string | null
          occupancy_rate?: number | null
          other_costs_owner?: number | null
          owner_acknowledged_at?: string | null
          owner_id?: string
          pdf_generated_at?: string | null
          pdf_url?: string | null
          period_end?: string
          period_start?: string
          platform_fees?: number | null
          property_id?: string
          report_type?: string
          sent_at?: string | null
          sent_to_email?: string | null
          status?: string | null
          supplies_costs_owner?: number | null
          total_bookings?: number | null
          total_costs_owner?: number | null
          total_nights_booked?: number | null
          updated_at?: string
          utilities_costs_owner?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "owner_reports_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "owner_reports_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "property_owners"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_history: {
        Row: {
          agency_id: string | null
          agent_id: string | null
          amount: number
          created_at: string
          currency: string | null
          description: string | null
          failure_reason: string | null
          id: string
          igic_amount: number | null
          invoice_number: string | null
          invoice_url: string | null
          paid_at: string | null
          period_end: string | null
          period_start: string | null
          receipt_url: string | null
          status: string
          stripe_charge_id: string | null
          stripe_invoice_id: string | null
          stripe_payment_intent_id: string | null
          subscription_id: string
          total_amount: number
        }
        Insert: {
          agency_id?: string | null
          agent_id?: string | null
          amount: number
          created_at?: string
          currency?: string | null
          description?: string | null
          failure_reason?: string | null
          id?: string
          igic_amount?: number | null
          invoice_number?: string | null
          invoice_url?: string | null
          paid_at?: string | null
          period_end?: string | null
          period_start?: string | null
          receipt_url?: string | null
          status: string
          stripe_charge_id?: string | null
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          subscription_id: string
          total_amount: number
        }
        Update: {
          agency_id?: string | null
          agent_id?: string | null
          amount?: number
          created_at?: string
          currency?: string | null
          description?: string | null
          failure_reason?: string | null
          id?: string
          igic_amount?: number | null
          invoice_number?: string | null
          invoice_url?: string | null
          paid_at?: string | null
          period_end?: string | null
          period_start?: string | null
          receipt_url?: string | null
          status?: string
          stripe_charge_id?: string | null
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          subscription_id?: string
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "payment_history_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_history_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_history_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_admins: {
        Row: {
          created_at: string | null
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      platform_modules: {
        Row: {
          addon_price: number | null
          category: string
          created_at: string | null
          description: string | null
          display_order: number | null
          icon: string | null
          id: string
          is_addon: boolean | null
          min_plan: Database["public"]["Enums"]["plan_type"]
          name: string
        }
        Insert: {
          addon_price?: number | null
          category?: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id: string
          is_addon?: boolean | null
          min_plan?: Database["public"]["Enums"]["plan_type"]
          name: string
        }
        Update: {
          addon_price?: number | null
          category?: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_addon?: boolean | null
          min_plan?: Database["public"]["Enums"]["plan_type"]
          name?: string
        }
        Relationships: []
      }
      platform_settings: {
        Row: {
          description: string | null
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          description?: string | null
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          description?: string | null
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      portal_configs: {
        Row: {
          agreement_status: string | null
          api_endpoint: string | null
          api_key: string | null
          api_secret: string | null
          cost_flat_monthly: number | null
          cost_per_property: number | null
          created_at: string
          display_name: string
          feed_format: Database["public"]["Enums"]["portal_feed_format"]
          feed_url: string | null
          id: string
          included_in_plan:
            | Database["public"]["Enums"]["subscription_plan"]
            | null
          is_active: boolean | null
          last_sync_at: string | null
          logo_url: string | null
          max_properties: number | null
          notes: string | null
          portal: Database["public"]["Enums"]["portal_name"]
          requires_agreement: boolean | null
          supported_operations:
            | Database["public"]["Enums"]["property_operation"][]
            | null
          supported_regions: string[] | null
          updated_at: string
        }
        Insert: {
          agreement_status?: string | null
          api_endpoint?: string | null
          api_key?: string | null
          api_secret?: string | null
          cost_flat_monthly?: number | null
          cost_per_property?: number | null
          created_at?: string
          display_name: string
          feed_format: Database["public"]["Enums"]["portal_feed_format"]
          feed_url?: string | null
          id?: string
          included_in_plan?:
            | Database["public"]["Enums"]["subscription_plan"]
            | null
          is_active?: boolean | null
          last_sync_at?: string | null
          logo_url?: string | null
          max_properties?: number | null
          notes?: string | null
          portal: Database["public"]["Enums"]["portal_name"]
          requires_agreement?: boolean | null
          supported_operations?:
            | Database["public"]["Enums"]["property_operation"][]
            | null
          supported_regions?: string[] | null
          updated_at?: string
        }
        Update: {
          agreement_status?: string | null
          api_endpoint?: string | null
          api_key?: string | null
          api_secret?: string | null
          cost_flat_monthly?: number | null
          cost_per_property?: number | null
          created_at?: string
          display_name?: string
          feed_format?: Database["public"]["Enums"]["portal_feed_format"]
          feed_url?: string | null
          id?: string
          included_in_plan?:
            | Database["public"]["Enums"]["subscription_plan"]
            | null
          is_active?: boolean | null
          last_sync_at?: string | null
          logo_url?: string | null
          max_properties?: number | null
          notes?: string | null
          portal?: Database["public"]["Enums"]["portal_name"]
          requires_agreement?: boolean | null
          supported_operations?:
            | Database["public"]["Enums"]["property_operation"][]
            | null
          supported_regions?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      portal_sync_log: {
        Row: {
          action: string
          created_at: string
          distribution_id: string | null
          duration_ms: number | null
          error_message: string | null
          id: string
          portal_id: string
          property_id: string | null
          request_data: Json | null
          response_data: Json | null
          status: string
        }
        Insert: {
          action: string
          created_at?: string
          distribution_id?: string | null
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          portal_id: string
          property_id?: string | null
          request_data?: Json | null
          response_data?: Json | null
          status: string
        }
        Update: {
          action?: string
          created_at?: string
          distribution_id?: string | null
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          portal_id?: string
          property_id?: string | null
          request_data?: Json | null
          response_data?: Json | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "portal_sync_log_distribution_id_fkey"
            columns: ["distribution_id"]
            isOneToOne: false
            referencedRelation: "property_portal_distribution"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portal_sync_log_portal_id_fkey"
            columns: ["portal_id"]
            isOneToOne: false
            referencedRelation: "portal_configs"
            referencedColumns: ["id"]
          },
        ]
      }
      press_mentions: {
        Row: {
          agent_id: string
          article_url: string | null
          created_at: string | null
          display_order: number | null
          id: string
          logo_url: string | null
          media_name: string
          updated_at: string | null
        }
        Insert: {
          agent_id: string
          article_url?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          logo_url?: string | null
          media_name: string
          updated_at?: string | null
        }
        Update: {
          agent_id?: string
          article_url?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          logo_url?: string | null
          media_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "press_mentions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agent_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      price_history: {
        Row: {
          applied_rules: string[] | null
          base_price: number
          calculated_price: number
          competition_factor: number | null
          created_at: string
          date: string
          demand_factor: number | null
          id: string
          occupancy_factor: number | null
          override_price: number | null
          property_id: string
          was_overridden: boolean | null
        }
        Insert: {
          applied_rules?: string[] | null
          base_price: number
          calculated_price: number
          competition_factor?: number | null
          created_at?: string
          date: string
          demand_factor?: number | null
          id?: string
          occupancy_factor?: number | null
          override_price?: number | null
          property_id: string
          was_overridden?: boolean | null
        }
        Update: {
          applied_rules?: string[] | null
          base_price?: number
          calculated_price?: number
          competition_factor?: number | null
          created_at?: string
          date?: string
          demand_factor?: number | null
          id?: string
          occupancy_factor?: number | null
          override_price?: number | null
          property_id?: string
          was_overridden?: boolean | null
        }
        Relationships: []
      }
      process_steps: {
        Row: {
          agent_id: string
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          step_number: number
          title: string
          updated_at: string | null
        }
        Insert: {
          agent_id: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          step_number: number
          title: string
          updated_at?: string | null
        }
        Update: {
          agent_id?: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          step_number?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "process_steps_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agent_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_referrals: {
        Row: {
          agent_id: string | null
          completed_at: string | null
          created_at: string
          id: string
          lead_id: string | null
          notes: string | null
          platform_commission: number | null
          professional_id: string
          property_id: string | null
          referral_fee: number | null
          service_description: string | null
          status: Database["public"]["Enums"]["referral_status"] | null
          updated_at: string
        }
        Insert: {
          agent_id?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          lead_id?: string | null
          notes?: string | null
          platform_commission?: number | null
          professional_id: string
          property_id?: string | null
          referral_fee?: number | null
          service_description?: string | null
          status?: Database["public"]["Enums"]["referral_status"] | null
          updated_at?: string
        }
        Update: {
          agent_id?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          lead_id?: string | null
          notes?: string | null
          platform_commission?: number | null
          professional_id?: string
          property_id?: string | null
          referral_fee?: number | null
          service_description?: string | null
          status?: Database["public"]["Enums"]["referral_status"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "professional_referrals_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "professional_referrals_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "professional_referrals_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      professionals: {
        Row: {
          address: string | null
          bio: Json | null
          category: Database["public"]["Enums"]["professional_category"]
          company: string | null
          created_at: string
          email: string
          id: string
          is_featured: boolean | null
          is_verified: boolean | null
          languages: string[] | null
          license_number: string | null
          metadata: Json | null
          municipality: string | null
          name: string
          phone: string | null
          photo_url: string | null
          rating: number | null
          referral_fee: number | null
          region: string | null
          review_count: number | null
          slug: string
          specialties: string[] | null
          status: Database["public"]["Enums"]["agent_status"] | null
          updated_at: string
          user_id: string | null
          website: string | null
          years_experience: number | null
        }
        Insert: {
          address?: string | null
          bio?: Json | null
          category: Database["public"]["Enums"]["professional_category"]
          company?: string | null
          created_at?: string
          email: string
          id?: string
          is_featured?: boolean | null
          is_verified?: boolean | null
          languages?: string[] | null
          license_number?: string | null
          metadata?: Json | null
          municipality?: string | null
          name: string
          phone?: string | null
          photo_url?: string | null
          rating?: number | null
          referral_fee?: number | null
          region?: string | null
          review_count?: number | null
          slug: string
          specialties?: string[] | null
          status?: Database["public"]["Enums"]["agent_status"] | null
          updated_at?: string
          user_id?: string | null
          website?: string | null
          years_experience?: number | null
        }
        Update: {
          address?: string | null
          bio?: Json | null
          category?: Database["public"]["Enums"]["professional_category"]
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          is_featured?: boolean | null
          is_verified?: boolean | null
          languages?: string[] | null
          license_number?: string | null
          metadata?: Json | null
          municipality?: string | null
          name?: string
          phone?: string | null
          photo_url?: string | null
          rating?: number | null
          referral_fee?: number | null
          region?: string | null
          review_count?: number | null
          slug?: string
          specialties?: string[] | null
          status?: Database["public"]["Enums"]["agent_status"] | null
          updated_at?: string
          user_id?: string | null
          website?: string | null
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "professionals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          country: string | null
          created_at: string
          email: string
          email_verified: boolean | null
          full_name: string | null
          id: string
          languages: string[] | null
          metadata: Json | null
          phone: string | null
          phone_verified: boolean | null
          preferred_language: string | null
          region: string | null
          role: Database["public"]["Enums"]["user_role"]
          timezone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          email: string
          email_verified?: boolean | null
          full_name?: string | null
          id: string
          languages?: string[] | null
          metadata?: Json | null
          phone?: string | null
          phone_verified?: boolean | null
          preferred_language?: string | null
          region?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          email?: string
          email_verified?: boolean | null
          full_name?: string | null
          id?: string
          languages?: string[] | null
          metadata?: Json | null
          phone?: string | null
          phone_verified?: boolean | null
          preferred_language?: string | null
          region?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          timezone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string | null
          agent_id: string
          airbnb_url: string | null
          badge: Database["public"]["Enums"]["property_badge"] | null
          bathrooms: number | null
          bedrooms: number | null
          booking_url: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          features: string[] | null
          id: string
          images: string[] | null
          is_active: boolean | null
          is_featured: boolean | null
          latitude: number | null
          location: string | null
          longitude: number | null
          operation_type: Database["public"]["Enums"]["operation_type"]
          plot_m2: number | null
          price: number | null
          price_per_night: number | null
          property_type: Database["public"]["Enums"]["property_type"]
          size_m2: number | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          agent_id: string
          airbnb_url?: string | null
          badge?: Database["public"]["Enums"]["property_badge"] | null
          bathrooms?: number | null
          bedrooms?: number | null
          booking_url?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          features?: string[] | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          operation_type: Database["public"]["Enums"]["operation_type"]
          plot_m2?: number | null
          price?: number | null
          price_per_night?: number | null
          property_type: Database["public"]["Enums"]["property_type"]
          size_m2?: number | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          agent_id?: string
          airbnb_url?: string | null
          badge?: Database["public"]["Enums"]["property_badge"] | null
          bathrooms?: number | null
          bedrooms?: number | null
          booking_url?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          features?: string[] | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          operation_type?: Database["public"]["Enums"]["operation_type"]
          plot_m2?: number | null
          price?: number | null
          price_per_night?: number | null
          property_type?: Database["public"]["Enums"]["property_type"]
          size_m2?: number | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agent_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      property_images: {
        Row: {
          alt_text: Json | null
          created_at: string
          height: number | null
          id: string
          is_main: boolean | null
          property_id: string
          size_bytes: number | null
          sort_order: number | null
          thumbnail_url: string | null
          url: string
          width: number | null
        }
        Insert: {
          alt_text?: Json | null
          created_at?: string
          height?: number | null
          id?: string
          is_main?: boolean | null
          property_id: string
          size_bytes?: number | null
          sort_order?: number | null
          thumbnail_url?: string | null
          url: string
          width?: number | null
        }
        Update: {
          alt_text?: Json | null
          created_at?: string
          height?: number | null
          id?: string
          is_main?: boolean | null
          property_id?: string
          size_bytes?: number | null
          sort_order?: number | null
          thumbnail_url?: string | null
          url?: string
          width?: number | null
        }
        Relationships: []
      }
      property_owners: {
        Row: {
          agent_id: string
          auto_renew: boolean | null
          bank_account: string | null
          commission_rate: number
          contract_end: string | null
          contract_start: string | null
          country: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          is_resident: boolean | null
          notes: string | null
          phone: string | null
          tax_id: string | null
          updated_at: string
        }
        Insert: {
          agent_id: string
          auto_renew?: boolean | null
          bank_account?: string | null
          commission_rate: number
          contract_end?: string | null
          contract_start?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          is_resident?: boolean | null
          notes?: string | null
          phone?: string | null
          tax_id?: string | null
          updated_at?: string
        }
        Update: {
          agent_id?: string
          auto_renew?: boolean | null
          bank_account?: string | null
          commission_rate?: number
          contract_end?: string | null
          contract_start?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          is_resident?: boolean | null
          notes?: string | null
          phone?: string | null
          tax_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_owners_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      property_ownership: {
        Row: {
          agent_id: string
          avg_time_per_turnover: number | null
          cleaning_cost: number | null
          cleaning_paid_by: string | null
          commission_rate: number
          created_at: string
          id: string
          insurance_cost_annual: number | null
          insurance_paid_by: string | null
          is_active: boolean | null
          km_distance: number | null
          laundry_cost_per_change: number | null
          laundry_paid_by: string | null
          maintenance_budget_monthly: number | null
          maintenance_paid_by: string | null
          management_end: string | null
          management_start: string
          notes: string | null
          owner_id: string
          owner_portal_access: boolean | null
          photography_paid_by: string | null
          platform_fees_paid_by: string | null
          property_id: string
          report_frequency: string | null
          report_include_photos: boolean | null
          report_language: string | null
          supplies_cost_monthly: number | null
          supplies_paid_by: string | null
          updated_at: string
          utilities_cost_monthly: number | null
          utilities_paid_by: string | null
        }
        Insert: {
          agent_id: string
          avg_time_per_turnover?: number | null
          cleaning_cost?: number | null
          cleaning_paid_by?: string | null
          commission_rate: number
          created_at?: string
          id?: string
          insurance_cost_annual?: number | null
          insurance_paid_by?: string | null
          is_active?: boolean | null
          km_distance?: number | null
          laundry_cost_per_change?: number | null
          laundry_paid_by?: string | null
          maintenance_budget_monthly?: number | null
          maintenance_paid_by?: string | null
          management_end?: string | null
          management_start: string
          notes?: string | null
          owner_id: string
          owner_portal_access?: boolean | null
          photography_paid_by?: string | null
          platform_fees_paid_by?: string | null
          property_id: string
          report_frequency?: string | null
          report_include_photos?: boolean | null
          report_language?: string | null
          supplies_cost_monthly?: number | null
          supplies_paid_by?: string | null
          updated_at?: string
          utilities_cost_monthly?: number | null
          utilities_paid_by?: string | null
        }
        Update: {
          agent_id?: string
          avg_time_per_turnover?: number | null
          cleaning_cost?: number | null
          cleaning_paid_by?: string | null
          commission_rate?: number
          created_at?: string
          id?: string
          insurance_cost_annual?: number | null
          insurance_paid_by?: string | null
          is_active?: boolean | null
          km_distance?: number | null
          laundry_cost_per_change?: number | null
          laundry_paid_by?: string | null
          maintenance_budget_monthly?: number | null
          maintenance_paid_by?: string | null
          management_end?: string | null
          management_start?: string
          notes?: string | null
          owner_id?: string
          owner_portal_access?: boolean | null
          photography_paid_by?: string | null
          platform_fees_paid_by?: string | null
          property_id?: string
          report_frequency?: string | null
          report_include_photos?: boolean | null
          report_language?: string | null
          supplies_cost_monthly?: number | null
          supplies_paid_by?: string | null
          updated_at?: string
          utilities_cost_monthly?: number | null
          utilities_paid_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_ownership_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_ownership_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "property_owners"
            referencedColumns: ["id"]
          },
        ]
      }
      property_portal_distribution: {
        Row: {
          agent_id: string
          auto_sync: boolean | null
          created_at: string
          error_message: string | null
          external_id: string | null
          external_url: string | null
          id: string
          last_pushed_at: string | null
          last_response: Json | null
          paused: boolean | null
          portal_id: string
          property_id: string
          retry_count: number | null
          status: Database["public"]["Enums"]["portal_sync_status"] | null
          updated_at: string
        }
        Insert: {
          agent_id: string
          auto_sync?: boolean | null
          created_at?: string
          error_message?: string | null
          external_id?: string | null
          external_url?: string | null
          id?: string
          last_pushed_at?: string | null
          last_response?: Json | null
          paused?: boolean | null
          portal_id: string
          property_id: string
          retry_count?: number | null
          status?: Database["public"]["Enums"]["portal_sync_status"] | null
          updated_at?: string
        }
        Update: {
          agent_id?: string
          auto_sync?: boolean | null
          created_at?: string
          error_message?: string | null
          external_id?: string | null
          external_url?: string | null
          id?: string
          last_pushed_at?: string | null
          last_response?: Json | null
          paused?: boolean | null
          portal_id?: string
          property_id?: string
          retry_count?: number | null
          status?: Database["public"]["Enums"]["portal_sync_status"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_portal_distribution_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_portal_distribution_portal_id_fkey"
            columns: ["portal_id"]
            isOneToOne: false
            referencedRelation: "portal_configs"
            referencedColumns: ["id"]
          },
        ]
      }
      property_profitability: {
        Row: {
          agent_commission: number | null
          agent_id: string
          avg_nightly_rate: number | null
          cleaning_costs: number | null
          created_at: string
          gross_income: number | null
          hours_dedicated: number | null
          id: string
          is_profitable: boolean | null
          laundry_costs: number | null
          maintenance_costs: number | null
          month: number
          net_profit: number | null
          nights_available: number | null
          nights_booked: number | null
          occupancy_rate: number | null
          other_costs: number | null
          owner_id: string | null
          owner_net: number | null
          platform_fees: number | null
          profit_per_hour: number | null
          property_id: string
          supplies_costs: number | null
          total_costs: number | null
          travel_costs: number | null
          turnovers_count: number | null
          updated_at: string
          year: number
        }
        Insert: {
          agent_commission?: number | null
          agent_id: string
          avg_nightly_rate?: number | null
          cleaning_costs?: number | null
          created_at?: string
          gross_income?: number | null
          hours_dedicated?: number | null
          id?: string
          is_profitable?: boolean | null
          laundry_costs?: number | null
          maintenance_costs?: number | null
          month: number
          net_profit?: number | null
          nights_available?: number | null
          nights_booked?: number | null
          occupancy_rate?: number | null
          other_costs?: number | null
          owner_id?: string | null
          owner_net?: number | null
          platform_fees?: number | null
          profit_per_hour?: number | null
          property_id: string
          supplies_costs?: number | null
          total_costs?: number | null
          travel_costs?: number | null
          turnovers_count?: number | null
          updated_at?: string
          year: number
        }
        Update: {
          agent_commission?: number | null
          agent_id?: string
          avg_nightly_rate?: number | null
          cleaning_costs?: number | null
          created_at?: string
          gross_income?: number | null
          hours_dedicated?: number | null
          id?: string
          is_profitable?: boolean | null
          laundry_costs?: number | null
          maintenance_costs?: number | null
          month?: number
          net_profit?: number | null
          nights_available?: number | null
          nights_booked?: number | null
          occupancy_rate?: number | null
          other_costs?: number | null
          owner_id?: string | null
          owner_net?: number | null
          platform_fees?: number | null
          profit_per_hour?: number | null
          property_id?: string
          supplies_costs?: number | null
          total_costs?: number | null
          travel_costs?: number | null
          turnovers_count?: number | null
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "property_profitability_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_profitability_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "property_owners"
            referencedColumns: ["id"]
          },
        ]
      }
      property_views: {
        Row: {
          country: string | null
          created_at: string
          device: string | null
          duration_seconds: number | null
          id: string
          ip_address: unknown
          property_id: string
          referrer: string | null
          session_id: string | null
          source: string | null
          user_id: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string
          device?: string | null
          duration_seconds?: number | null
          id?: string
          ip_address?: unknown
          property_id: string
          referrer?: string | null
          session_id?: string | null
          source?: string | null
          user_id?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string
          device?: string | null
          duration_seconds?: number | null
          id?: string
          ip_address?: unknown
          property_id?: string
          referrer?: string | null
          session_id?: string | null
          source?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_views_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      regions: {
        Row: {
          country: string
          created_at: string
          currency: string | null
          id: string
          is_active: boolean | null
          municipalities: string[] | null
          name: string
          settings: Json | null
          tax_rate: number
          tax_type: string
          timezone: string | null
        }
        Insert: {
          country?: string
          created_at?: string
          currency?: string | null
          id: string
          is_active?: boolean | null
          municipalities?: string[] | null
          name: string
          settings?: Json | null
          tax_rate?: number
          tax_type?: string
          timezone?: string | null
        }
        Update: {
          country?: string
          created_at?: string
          currency?: string | null
          id?: string
          is_active?: boolean | null
          municipalities?: string[] | null
          name?: string
          settings?: Json | null
          tax_rate?: number
          tax_type?: string
          timezone?: string | null
        }
        Relationships: []
      }
      search_history: {
        Row: {
          bedrooms_min: number | null
          created_at: string
          features: string[] | null
          id: string
          ip_address: unknown
          municipalities: string[] | null
          operation: Database["public"]["Enums"]["property_operation"] | null
          price_max: number | null
          price_min: number | null
          properties_viewed: string[] | null
          results_count: number | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
          zones: string[] | null
        }
        Insert: {
          bedrooms_min?: number | null
          created_at?: string
          features?: string[] | null
          id?: string
          ip_address?: unknown
          municipalities?: string[] | null
          operation?: Database["public"]["Enums"]["property_operation"] | null
          price_max?: number | null
          price_min?: number | null
          properties_viewed?: string[] | null
          results_count?: number | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          zones?: string[] | null
        }
        Update: {
          bedrooms_min?: number | null
          created_at?: string
          features?: string[] | null
          id?: string
          ip_address?: unknown
          municipalities?: string[] | null
          operation?: Database["public"]["Enums"]["property_operation"] | null
          price_max?: number | null
          price_min?: number | null
          properties_viewed?: string[] | null
          results_count?: number | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          zones?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "search_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      seasonal_pricing: {
        Row: {
          agent_id: string
          created_at: string
          end_date: string
          id: string
          is_recurring: boolean | null
          minimum_stay: number | null
          name: string
          price_per_night: number
          property_id: string
          start_date: string
          updated_at: string
        }
        Insert: {
          agent_id: string
          created_at?: string
          end_date: string
          id?: string
          is_recurring?: boolean | null
          minimum_stay?: number | null
          name: string
          price_per_night: number
          property_id: string
          start_date: string
          updated_at?: string
        }
        Update: {
          agent_id?: string
          created_at?: string
          end_date?: string
          id?: string
          is_recurring?: boolean | null
          minimum_stay?: number | null
          name?: string
          price_per_night?: number
          property_id?: string
          start_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "seasonal_pricing_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      security_deposits: {
        Row: {
          agent_id: string
          amount: number
          authorized_at: string | null
          booking_id: string
          claim_description: string | null
          claim_photos: string[] | null
          claim_reason: string | null
          claimed_amount: number | null
          created_at: string
          currency: string | null
          id: string
          notes: string | null
          property_id: string
          released_at: string | null
          status: Database["public"]["Enums"]["deposit_status"] | null
          stripe_payment_intent_id: string | null
          updated_at: string
        }
        Insert: {
          agent_id: string
          amount: number
          authorized_at?: string | null
          booking_id: string
          claim_description?: string | null
          claim_photos?: string[] | null
          claim_reason?: string | null
          claimed_amount?: number | null
          created_at?: string
          currency?: string | null
          id?: string
          notes?: string | null
          property_id: string
          released_at?: string | null
          status?: Database["public"]["Enums"]["deposit_status"] | null
          stripe_payment_intent_id?: string | null
          updated_at?: string
        }
        Update: {
          agent_id?: string
          amount?: number
          authorized_at?: string | null
          booking_id?: string
          claim_description?: string | null
          claim_photos?: string[] | null
          claim_reason?: string | null
          claimed_amount?: number | null
          created_at?: string
          currency?: string | null
          id?: string
          notes?: string | null
          property_id?: string
          released_at?: string | null
          status?: Database["public"]["Enums"]["deposit_status"] | null
          stripe_payment_intent_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "security_deposits_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "security_deposits_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      service_providers: {
        Row: {
          agent_id: string
          company: string | null
          created_at: string
          email: string | null
          hourly_rate: number | null
          id: string
          is_active: boolean | null
          name: string
          notes: string | null
          phone: string | null
          rating: number | null
          specialty: string
          total_tasks_completed: number | null
          updated_at: string
          zones: string[] | null
        }
        Insert: {
          agent_id: string
          company?: string | null
          created_at?: string
          email?: string | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          notes?: string | null
          phone?: string | null
          rating?: number | null
          specialty: string
          total_tasks_completed?: number | null
          updated_at?: string
          zones?: string[] | null
        }
        Update: {
          agent_id?: string
          company?: string | null
          created_at?: string
          email?: string | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          notes?: string | null
          phone?: string | null
          rating?: number | null
          specialty?: string
          total_tasks_completed?: number | null
          updated_at?: string
          zones?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "service_providers_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          agent_id: string
          created_at: string | null
          description: string | null
          display_order: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          agent_id: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          agent_id?: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agent_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      smart_locks: {
        Row: {
          agent_id: string
          api_key: string | null
          api_token: string | null
          auto_lock_seconds: number | null
          battery_level: number | null
          brand: Database["public"]["Enums"]["lock_brand"]
          bridge_id: string | null
          created_at: string
          device_id: string
          firmware_version: string | null
          id: string
          is_active: boolean | null
          is_online: boolean | null
          last_activity_at: string | null
          location: string | null
          model: string | null
          name: string | null
          property_id: string
          updated_at: string
        }
        Insert: {
          agent_id: string
          api_key?: string | null
          api_token?: string | null
          auto_lock_seconds?: number | null
          battery_level?: number | null
          brand: Database["public"]["Enums"]["lock_brand"]
          bridge_id?: string | null
          created_at?: string
          device_id: string
          firmware_version?: string | null
          id?: string
          is_active?: boolean | null
          is_online?: boolean | null
          last_activity_at?: string | null
          location?: string | null
          model?: string | null
          name?: string | null
          property_id: string
          updated_at?: string
        }
        Update: {
          agent_id?: string
          api_key?: string | null
          api_token?: string | null
          auto_lock_seconds?: number | null
          battery_level?: number | null
          brand?: Database["public"]["Enums"]["lock_brand"]
          bridge_id?: string | null
          created_at?: string
          device_id?: string
          firmware_version?: string | null
          id?: string
          is_active?: boolean | null
          is_online?: boolean | null
          last_activity_at?: string | null
          location?: string | null
          model?: string | null
          name?: string | null
          property_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "smart_locks_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_customers: {
        Row: {
          agent_id: string
          created_at: string | null
          current_period_end: string | null
          id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_status: string | null
          updated_at: string | null
        }
        Insert: {
          agent_id: string
          created_at?: string | null
          current_period_end?: string | null
          id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
          updated_at?: string | null
        }
        Update: {
          agent_id?: string
          created_at?: string | null
          current_period_end?: string | null
          id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stripe_customers_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: true
            referencedRelation: "agent_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_addons: {
        Row: {
          addon_type: Database["public"]["Enums"]["addon_type"]
          cancelled_at: string | null
          created_at: string
          id: string
          igic_amount: number | null
          is_active: boolean | null
          price_monthly: number
          started_at: string | null
          stripe_subscription_item_id: string | null
          subscription_id: string
          total_monthly: number
          updated_at: string
        }
        Insert: {
          addon_type: Database["public"]["Enums"]["addon_type"]
          cancelled_at?: string | null
          created_at?: string
          id?: string
          igic_amount?: number | null
          is_active?: boolean | null
          price_monthly: number
          started_at?: string | null
          stripe_subscription_item_id?: string | null
          subscription_id: string
          total_monthly: number
          updated_at?: string
        }
        Update: {
          addon_type?: Database["public"]["Enums"]["addon_type"]
          cancelled_at?: string | null
          created_at?: string
          id?: string
          igic_amount?: number | null
          is_active?: boolean | null
          price_monthly?: number
          started_at?: string | null
          stripe_subscription_item_id?: string | null
          subscription_id?: string
          total_monthly?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_addons_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          accounting_access: boolean | null
          agency_id: string | null
          agent_id: string | null
          cancel_at: string | null
          cancelled_at: string | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          email_marketing_access: boolean | null
          id: string
          igic_amount: number | null
          igic_rate: number | null
          max_email_campaigns_monthly: number | null
          max_leads_monthly: number | null
          max_portals: number | null
          max_properties: number | null
          mls_access: boolean | null
          plan: Database["public"]["Enums"]["subscription_plan"]
          price_monthly: number
          status: Database["public"]["Enums"]["subscription_status"] | null
          stripe_customer_id: string | null
          stripe_price_id: string | null
          stripe_subscription_id: string | null
          total_monthly: number
          trial_end: string | null
          updated_at: string
          vacation_rental_access: boolean | null
        }
        Insert: {
          accounting_access?: boolean | null
          agency_id?: string | null
          agent_id?: string | null
          cancel_at?: string | null
          cancelled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          email_marketing_access?: boolean | null
          id?: string
          igic_amount?: number | null
          igic_rate?: number | null
          max_email_campaigns_monthly?: number | null
          max_leads_monthly?: number | null
          max_portals?: number | null
          max_properties?: number | null
          mls_access?: boolean | null
          plan?: Database["public"]["Enums"]["subscription_plan"]
          price_monthly?: number
          status?: Database["public"]["Enums"]["subscription_status"] | null
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          total_monthly?: number
          trial_end?: string | null
          updated_at?: string
          vacation_rental_access?: boolean | null
        }
        Update: {
          accounting_access?: boolean | null
          agency_id?: string | null
          agent_id?: string | null
          cancel_at?: string | null
          cancelled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          email_marketing_access?: boolean | null
          id?: string
          igic_amount?: number | null
          igic_rate?: number | null
          max_email_campaigns_monthly?: number | null
          max_leads_monthly?: number | null
          max_portals?: number | null
          max_properties?: number | null
          mls_access?: boolean | null
          plan?: Database["public"]["Enums"]["subscription_plan"]
          price_monthly?: number
          status?: Database["public"]["Enums"]["subscription_status"] | null
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          total_monthly?: number
          trial_end?: string | null
          updated_at?: string
          vacation_rental_access?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          actual_cost: number | null
          agent_id: string
          assigned_at: string | null
          assigned_to_email: string | null
          assigned_to_name: string | null
          assigned_to_phone: string | null
          booking_id: string | null
          category: Database["public"]["Enums"]["task_category"]
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          due_time: string | null
          estimated_cost: number | null
          id: string
          is_recurring: boolean | null
          next_occurrence: string | null
          notes: string | null
          paid_by: string | null
          photos_after: string[] | null
          photos_before: string[] | null
          priority: Database["public"]["Enums"]["task_priority"] | null
          property_id: string | null
          receipt_url: string | null
          recurring_interval: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["task_status"] | null
          title: string
          updated_at: string
        }
        Insert: {
          actual_cost?: number | null
          agent_id: string
          assigned_at?: string | null
          assigned_to_email?: string | null
          assigned_to_name?: string | null
          assigned_to_phone?: string | null
          booking_id?: string | null
          category: Database["public"]["Enums"]["task_category"]
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          due_time?: string | null
          estimated_cost?: number | null
          id?: string
          is_recurring?: boolean | null
          next_occurrence?: string | null
          notes?: string | null
          paid_by?: string | null
          photos_after?: string[] | null
          photos_before?: string[] | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          property_id?: string | null
          receipt_url?: string | null
          recurring_interval?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          title: string
          updated_at?: string
        }
        Update: {
          actual_cost?: number | null
          agent_id?: string
          assigned_at?: string | null
          assigned_to_email?: string | null
          assigned_to_name?: string | null
          assigned_to_phone?: string | null
          booking_id?: string | null
          category?: Database["public"]["Enums"]["task_category"]
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          due_time?: string | null
          estimated_cost?: number | null
          id?: string
          is_recurring?: boolean | null
          next_occurrence?: string | null
          notes?: string | null
          paid_by?: string | null
          photos_after?: string[] | null
          photos_before?: string[] | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          property_id?: string | null
          receipt_url?: string | null
          recurring_interval?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_declarations: {
        Row: {
          agent_id: string
          created_at: string
          due_date: string
          expense_total: number | null
          filed_at: string | null
          fiscal_year: number
          id: string
          igic_collected: number | null
          igic_paid: number | null
          igic_to_pay: number | null
          income_total: number | null
          irpf_base: number | null
          irpf_rate: number | null
          irpf_to_pay: number | null
          model: Database["public"]["Enums"]["tax_model"]
          notes: string | null
          paid_at: string | null
          payment_reference: string | null
          pdf_url: string | null
          quarter: string
          status: string | null
          updated_at: string
        }
        Insert: {
          agent_id: string
          created_at?: string
          due_date: string
          expense_total?: number | null
          filed_at?: string | null
          fiscal_year: number
          id?: string
          igic_collected?: number | null
          igic_paid?: number | null
          igic_to_pay?: number | null
          income_total?: number | null
          irpf_base?: number | null
          irpf_rate?: number | null
          irpf_to_pay?: number | null
          model: Database["public"]["Enums"]["tax_model"]
          notes?: string | null
          paid_at?: string | null
          payment_reference?: string | null
          pdf_url?: string | null
          quarter: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          agent_id?: string
          created_at?: string
          due_date?: string
          expense_total?: number | null
          filed_at?: string | null
          fiscal_year?: number
          id?: string
          igic_collected?: number | null
          igic_paid?: number | null
          igic_to_pay?: number | null
          income_total?: number | null
          irpf_base?: number | null
          irpf_rate?: number | null
          irpf_to_pay?: number | null
          model?: Database["public"]["Enums"]["tax_model"]
          notes?: string | null
          paid_at?: string | null
          payment_reference?: string | null
          pdf_url?: string | null
          quarter?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tax_declarations_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          agent_id: string
          bio: string | null
          created_at: string | null
          display_order: number | null
          email: string | null
          id: string
          is_active: boolean | null
          languages: string[] | null
          name: string
          phone: string | null
          photo_url: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          agent_id: string
          bio?: string | null
          created_at?: string | null
          display_order?: number | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          languages?: string[] | null
          name: string
          phone?: string | null
          photo_url?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          agent_id?: string
          bio?: string | null
          created_at?: string | null
          display_order?: number | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          languages?: string[] | null
          name?: string
          phone?: string | null
          photo_url?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_members_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agent_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          agent_id: string
          client_location: string | null
          client_name: string
          client_nationality: string | null
          created_at: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          quote: string
          rating: number | null
          updated_at: string | null
        }
        Insert: {
          agent_id: string
          client_location?: string | null
          client_name: string
          client_nationality?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          quote: string
          rating?: number | null
          updated_at?: string | null
        }
        Update: {
          agent_id?: string
          client_location?: string | null
          client_name?: string
          client_nationality?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          quote?: string
          rating?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agent_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      translation_queue: {
        Row: {
          created_at: string
          entity_id: string
          entity_type: string
          error_message: string | null
          field: string
          id: string
          processed_at: string | null
          source_language: string
          source_text: string
          status: string | null
          target_language: string
          translated_text: string | null
        }
        Insert: {
          created_at?: string
          entity_id: string
          entity_type: string
          error_message?: string | null
          field: string
          id?: string
          processed_at?: string | null
          source_language: string
          source_text: string
          status?: string | null
          target_language: string
          translated_text?: string | null
        }
        Update: {
          created_at?: string
          entity_id?: string
          entity_type?: string
          error_message?: string | null
          field?: string
          id?: string
          processed_at?: string | null
          source_language?: string
          source_text?: string
          status?: string | null
          target_language?: string
          translated_text?: string | null
        }
        Relationships: []
      }
      zones: {
        Row: {
          agent_id: string
          average_price: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          property_count: number | null
          updated_at: string | null
        }
        Insert: {
          agent_id: string
          average_price?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          property_count?: number | null
          updated_at?: string | null
        }
        Update: {
          agent_id?: string
          average_price?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          property_count?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "zones_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agent_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      agent_monthly_profitability: {
        Row: {
          agent_id: string | null
          avg_occupancy: number | null
          avg_profit_per_hour: number | null
          month: number | null
          properties_managed: number | null
          total_commission: number | null
          total_costs: number | null
          total_gross: number | null
          total_net_profit: number | null
          total_nights_booked: number | null
          unprofitable_properties: number | null
          year: number | null
        }
        Relationships: [
          {
            foreignKeyName: "property_profitability_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_performance: {
        Row: {
          agent_id: string | null
          agent_name: string | null
          body_html: Json | null
          calc_click_rate: number | null
          calc_open_rate: number | null
          click_rate: number | null
          created_at: string | null
          featured_property_ids: string[] | null
          id: string | null
          name: string | null
          open_rate: number | null
          preview_text: string | null
          scheduled_at: string | null
          segment_id: string | null
          segment_name: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["campaign_status"] | null
          subject: Json | null
          tags: string[] | null
          template_id: string | null
          template_name: string | null
          total_bounced: number | null
          total_clicked: number | null
          total_delivered: number | null
          total_opened: number | null
          total_recipients: number | null
          total_sent: number | null
          total_unsubscribed: number | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_campaigns_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_campaigns_segment_id_fkey"
            columns: ["segment_id"]
            isOneToOne: false
            referencedRelation: "email_segments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_campaigns_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      quarterly_summary: {
        Row: {
          agent_id: string | null
          fiscal_year: number | null
          igic_collected: number | null
          igic_deductible: number | null
          igic_to_pay: number | null
          net_profit: number | null
          quarter: string | null
          total_expenses: number | null
          total_income: number | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_transactions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      get_current_agent_id: { Args: never; Returns: string }
      is_platform_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      access_code_status: "active" | "expired" | "revoked" | "pending"
      addon_type:
        | "email_marketing"
        | "extra_portals"
        | "extra_properties"
        | "api_access"
        | "white_label"
        | "priority_support"
      agent_status: "pending" | "active" | "suspended" | "inactive"
      auto_message_trigger:
        | "booking_confirmed"
        | "pre_checkin_24h"
        | "pre_checkin_1h"
        | "checkin_day"
        | "during_stay_day2"
        | "pre_checkout_24h"
        | "checkout_day"
        | "post_checkout_review"
        | "inquiry_response"
        | "payment_reminder"
        | "custom"
      booking_source:
        | "airbnb"
        | "booking_com"
        | "vrbo"
        | "direct"
        | "other_channel"
        | "platform"
      booking_status:
        | "inquiry"
        | "pending"
        | "confirmed"
        | "checked_in"
        | "checked_out"
        | "cancelled"
        | "no_show"
      business_type: "individual" | "agency" | "network"
      buyer_purpose:
        | "primary_residence"
        | "holiday_home"
        | "investment"
        | "rental_business"
        | "retirement"
        | "relocation"
      buyer_timeline:
        | "immediate"
        | "1_3_months"
        | "3_6_months"
        | "6_12_months"
        | "exploring"
      campaign_status:
        | "draft"
        | "scheduled"
        | "sending"
        | "sent"
        | "paused"
        | "cancelled"
      channel_type:
        | "airbnb"
        | "booking_com"
        | "vrbo"
        | "homeaway"
        | "expedia"
        | "direct"
        | "other"
      cleaning_status:
        | "pending"
        | "assigned"
        | "in_progress"
        | "completed"
        | "issue_reported"
      deposit_status:
        | "pending"
        | "held"
        | "released"
        | "claimed_partial"
        | "claimed_full"
        | "refunded"
      email_event_type:
        | "sent"
        | "delivered"
        | "opened"
        | "clicked"
        | "bounced"
        | "unsubscribed"
        | "spam_reported"
      expense_category:
        | "cleaning"
        | "maintenance"
        | "marketing"
        | "platform_subscription"
        | "insurance"
        | "travel"
        | "supplies"
        | "laundry"
        | "photography"
        | "staging"
        | "legal"
        | "tax_advisory"
        | "office"
        | "phone"
        | "internet"
        | "other_expense"
      income_category:
        | "sale_commission"
        | "rental_commission"
        | "vacation_rental"
        | "referral_fee"
        | "platform_fee"
        | "mls_commission"
        | "consulting"
        | "other_income"
      inventory_condition:
        | "new"
        | "good"
        | "fair"
        | "needs_replacement"
        | "missing"
      invoice_status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
      lead_source:
        | "portal"
        | "website"
        | "referral"
        | "walk_in"
        | "phone"
        | "whatsapp"
        | "email"
        | "social_media"
        | "mls"
        | "platform_lead"
      lead_status:
        | "new"
        | "contacted"
        | "qualified"
        | "viewing_scheduled"
        | "offer_made"
        | "negotiating"
        | "won"
        | "lost"
        | "nurturing"
      listing_source:
        | "manual"
        | "xml_import"
        | "csv_import"
        | "portal_scrape"
        | "mls_shared"
        | "api"
      lock_brand:
        | "nuki"
        | "august"
        | "yale"
        | "ttlock"
        | "igloohome"
        | "schlage"
        | "keywe"
        | "other"
      message_channel:
        | "airbnb"
        | "booking_com"
        | "vrbo"
        | "whatsapp"
        | "email"
        | "sms"
        | "platform_chat"
        | "phone"
      message_direction: "inbound" | "outbound"
      message_status: "pending" | "sent" | "delivered" | "read" | "failed"
      notification_type:
        | "lead"
        | "booking"
        | "message"
        | "payment"
        | "tax_reminder"
        | "sync_error"
        | "review"
        | "mls_match"
        | "task"
        | "maintenance"
        | "access_code"
        | "system"
      operation_type: "sale" | "rent_long" | "rent_vacation"
      palette_name:
        | "ocean"
        | "volcanic"
        | "sunset"
        | "forest"
        | "arctic"
        | "sand"
      plan_type: "starter" | "pro" | "premium" | "agency"
      portal_feed_format:
        | "json_api"
        | "soap_api"
        | "xml_feed"
        | "rest_api"
        | "aggregator"
      portal_name:
        | "idealista"
        | "fotocasa"
        | "habitaclia"
        | "milanuncios"
        | "pisos_com"
        | "kyero"
        | "rightmove"
        | "thinkspain"
        | "immoscout24"
        | "immowelt"
        | "green_acres"
        | "a_place_in_the_sun"
        | "xml_combined"
      portal_sync_status:
        | "published"
        | "pending"
        | "error"
        | "paused"
        | "not_configured"
      professional_category:
        | "lawyer"
        | "architect"
        | "surveyor"
        | "notary"
        | "tax_advisor"
        | "mortgage_broker"
        | "interior_designer"
        | "moving_company"
        | "photographer"
        | "other"
      property_badge:
        | "exclusive"
        | "new"
        | "reduced"
        | "featured"
        | "investment"
      property_operation:
        | "sale"
        | "vacation_rental"
        | "long_term_rental"
        | "sale_and_rental"
      property_status:
        | "draft"
        | "active"
        | "reserved"
        | "sold"
        | "rented"
        | "inactive"
        | "archived"
      property_type:
        | "villa"
        | "apartment"
        | "penthouse"
        | "townhouse"
        | "commercial"
        | "land"
        | "finca"
      referral_status:
        | "pending"
        | "contacted"
        | "in_progress"
        | "completed"
        | "cancelled"
      subscription_plan: "free" | "pro" | "premium" | "agency"
      subscription_status:
        | "active"
        | "past_due"
        | "cancelled"
        | "trialing"
        | "paused"
      sync_direction: "push" | "pull" | "bidirectional"
      sync_status: "synced" | "pending" | "error" | "disconnected"
      task_category:
        | "cleaning"
        | "maintenance"
        | "repair"
        | "inspection"
        | "inventory_check"
        | "photography"
        | "key_handover"
        | "guest_issue"
        | "administrative"
        | "other"
      task_priority: "low" | "medium" | "high" | "urgent"
      task_status:
        | "pending"
        | "assigned"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "blocked"
      tax_model:
        | "modelo_420"
        | "modelo_130"
        | "modelo_303"
        | "modelo_111"
        | "annual_igic"
      template_name:
        | "luxury"
        | "mediterranean"
        | "corporate"
        | "corporate_boutique"
        | "classic"
        | "corporate_network"
        | "corporate_data"
      template_type:
        | "luxury"
        | "mediterranean"
        | "corporate"
        | "boutique"
        | "network"
      transaction_type: "income" | "expense"
      user_role:
        | "buyer"
        | "agent"
        | "agency_admin"
        | "professional"
        | "platform_admin"
      verification_status: "pending" | "verified" | "rejected" | "expired"
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
      access_code_status: ["active", "expired", "revoked", "pending"],
      addon_type: [
        "email_marketing",
        "extra_portals",
        "extra_properties",
        "api_access",
        "white_label",
        "priority_support",
      ],
      agent_status: ["pending", "active", "suspended", "inactive"],
      auto_message_trigger: [
        "booking_confirmed",
        "pre_checkin_24h",
        "pre_checkin_1h",
        "checkin_day",
        "during_stay_day2",
        "pre_checkout_24h",
        "checkout_day",
        "post_checkout_review",
        "inquiry_response",
        "payment_reminder",
        "custom",
      ],
      booking_source: [
        "airbnb",
        "booking_com",
        "vrbo",
        "direct",
        "other_channel",
        "platform",
      ],
      booking_status: [
        "inquiry",
        "pending",
        "confirmed",
        "checked_in",
        "checked_out",
        "cancelled",
        "no_show",
      ],
      business_type: ["individual", "agency", "network"],
      buyer_purpose: [
        "primary_residence",
        "holiday_home",
        "investment",
        "rental_business",
        "retirement",
        "relocation",
      ],
      buyer_timeline: [
        "immediate",
        "1_3_months",
        "3_6_months",
        "6_12_months",
        "exploring",
      ],
      campaign_status: [
        "draft",
        "scheduled",
        "sending",
        "sent",
        "paused",
        "cancelled",
      ],
      channel_type: [
        "airbnb",
        "booking_com",
        "vrbo",
        "homeaway",
        "expedia",
        "direct",
        "other",
      ],
      cleaning_status: [
        "pending",
        "assigned",
        "in_progress",
        "completed",
        "issue_reported",
      ],
      deposit_status: [
        "pending",
        "held",
        "released",
        "claimed_partial",
        "claimed_full",
        "refunded",
      ],
      email_event_type: [
        "sent",
        "delivered",
        "opened",
        "clicked",
        "bounced",
        "unsubscribed",
        "spam_reported",
      ],
      expense_category: [
        "cleaning",
        "maintenance",
        "marketing",
        "platform_subscription",
        "insurance",
        "travel",
        "supplies",
        "laundry",
        "photography",
        "staging",
        "legal",
        "tax_advisory",
        "office",
        "phone",
        "internet",
        "other_expense",
      ],
      income_category: [
        "sale_commission",
        "rental_commission",
        "vacation_rental",
        "referral_fee",
        "platform_fee",
        "mls_commission",
        "consulting",
        "other_income",
      ],
      inventory_condition: [
        "new",
        "good",
        "fair",
        "needs_replacement",
        "missing",
      ],
      invoice_status: ["draft", "sent", "paid", "overdue", "cancelled"],
      lead_source: [
        "portal",
        "website",
        "referral",
        "walk_in",
        "phone",
        "whatsapp",
        "email",
        "social_media",
        "mls",
        "platform_lead",
      ],
      lead_status: [
        "new",
        "contacted",
        "qualified",
        "viewing_scheduled",
        "offer_made",
        "negotiating",
        "won",
        "lost",
        "nurturing",
      ],
      listing_source: [
        "manual",
        "xml_import",
        "csv_import",
        "portal_scrape",
        "mls_shared",
        "api",
      ],
      lock_brand: [
        "nuki",
        "august",
        "yale",
        "ttlock",
        "igloohome",
        "schlage",
        "keywe",
        "other",
      ],
      message_channel: [
        "airbnb",
        "booking_com",
        "vrbo",
        "whatsapp",
        "email",
        "sms",
        "platform_chat",
        "phone",
      ],
      message_direction: ["inbound", "outbound"],
      message_status: ["pending", "sent", "delivered", "read", "failed"],
      notification_type: [
        "lead",
        "booking",
        "message",
        "payment",
        "tax_reminder",
        "sync_error",
        "review",
        "mls_match",
        "task",
        "maintenance",
        "access_code",
        "system",
      ],
      operation_type: ["sale", "rent_long", "rent_vacation"],
      palette_name: ["ocean", "volcanic", "sunset", "forest", "arctic", "sand"],
      plan_type: ["starter", "pro", "premium", "agency"],
      portal_feed_format: [
        "json_api",
        "soap_api",
        "xml_feed",
        "rest_api",
        "aggregator",
      ],
      portal_name: [
        "idealista",
        "fotocasa",
        "habitaclia",
        "milanuncios",
        "pisos_com",
        "kyero",
        "rightmove",
        "thinkspain",
        "immoscout24",
        "immowelt",
        "green_acres",
        "a_place_in_the_sun",
        "xml_combined",
      ],
      portal_sync_status: [
        "published",
        "pending",
        "error",
        "paused",
        "not_configured",
      ],
      professional_category: [
        "lawyer",
        "architect",
        "surveyor",
        "notary",
        "tax_advisor",
        "mortgage_broker",
        "interior_designer",
        "moving_company",
        "photographer",
        "other",
      ],
      property_badge: ["exclusive", "new", "reduced", "featured", "investment"],
      property_operation: [
        "sale",
        "vacation_rental",
        "long_term_rental",
        "sale_and_rental",
      ],
      property_status: [
        "draft",
        "active",
        "reserved",
        "sold",
        "rented",
        "inactive",
        "archived",
      ],
      property_type: [
        "villa",
        "apartment",
        "penthouse",
        "townhouse",
        "commercial",
        "land",
        "finca",
      ],
      referral_status: [
        "pending",
        "contacted",
        "in_progress",
        "completed",
        "cancelled",
      ],
      subscription_plan: ["free", "pro", "premium", "agency"],
      subscription_status: [
        "active",
        "past_due",
        "cancelled",
        "trialing",
        "paused",
      ],
      sync_direction: ["push", "pull", "bidirectional"],
      sync_status: ["synced", "pending", "error", "disconnected"],
      task_category: [
        "cleaning",
        "maintenance",
        "repair",
        "inspection",
        "inventory_check",
        "photography",
        "key_handover",
        "guest_issue",
        "administrative",
        "other",
      ],
      task_priority: ["low", "medium", "high", "urgent"],
      task_status: [
        "pending",
        "assigned",
        "in_progress",
        "completed",
        "cancelled",
        "blocked",
      ],
      tax_model: [
        "modelo_420",
        "modelo_130",
        "modelo_303",
        "modelo_111",
        "annual_igic",
      ],
      template_name: [
        "luxury",
        "mediterranean",
        "corporate",
        "corporate_boutique",
        "classic",
        "corporate_network",
        "corporate_data",
      ],
      template_type: [
        "luxury",
        "mediterranean",
        "corporate",
        "boutique",
        "network",
      ],
      transaction_type: ["income", "expense"],
      user_role: [
        "buyer",
        "agent",
        "agency_admin",
        "professional",
        "platform_admin",
      ],
      verification_status: ["pending", "verified", "rejected", "expired"],
    },
  },
} as const
