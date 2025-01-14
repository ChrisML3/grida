export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  grida_commerce: {
    Tables: {
      inventory_item: {
        Row: {
          available: number
          cost: number | null
          created_at: string
          id: number
          product_id: number | null
          sku: string
          store_id: number
          variant_id: number | null
        }
        Insert: {
          available?: number
          cost?: number | null
          created_at?: string
          id?: number
          product_id?: number | null
          sku: string
          store_id: number
          variant_id?: number | null
        }
        Update: {
          available?: number
          cost?: number | null
          created_at?: string
          id?: number
          product_id?: number | null
          sku?: string
          store_id?: number
          variant_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_item_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_item_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "store"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_item_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variant"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_level: {
        Row: {
          available: number
          created_at: string
          id: number
          inventory_item_id: number
        }
        Insert: {
          available?: number
          created_at?: string
          id?: number
          inventory_item_id: number
        }
        Update: {
          available?: number
          created_at?: string
          id?: number
          inventory_item_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "inventory_level_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_item"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_level_commit: {
        Row: {
          created_at: string
          diff: number | null
          id: number
          inventory_level_id: number
          reason: Database["grida_commerce"]["Enums"]["inventory_level_commit_reason"]
        }
        Insert: {
          created_at?: string
          diff?: number | null
          id?: number
          inventory_level_id: number
          reason?: Database["grida_commerce"]["Enums"]["inventory_level_commit_reason"]
        }
        Update: {
          created_at?: string
          diff?: number | null
          id?: number
          inventory_level_id?: number
          reason?: Database["grida_commerce"]["Enums"]["inventory_level_commit_reason"]
        }
        Relationships: [
          {
            foreignKeyName: "inventory_level_commit_inventory_level_id_fkey"
            columns: ["inventory_level_id"]
            isOneToOne: false
            referencedRelation: "inventory_level"
            referencedColumns: ["id"]
          },
        ]
      }
      product: {
        Row: {
          body_html: string | null
          created_at: string
          id: number
          name: string
          sku: string | null
          store_id: number
        }
        Insert: {
          body_html?: string | null
          created_at?: string
          id?: number
          name: string
          sku?: string | null
          store_id: number
        }
        Update: {
          body_html?: string | null
          created_at?: string
          id?: number
          name?: string
          sku?: string | null
          store_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "store"
            referencedColumns: ["id"]
          },
        ]
      }
      product_option: {
        Row: {
          created_at: string
          id: number
          name: string
          product_id: number
          store_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          product_id: number
          store_id: number
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          product_id?: number
          store_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "option_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "option_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "store"
            referencedColumns: ["id"]
          },
        ]
      }
      product_option_combination: {
        Row: {
          created_at: string
          id: number
          name: string | null
          product_id: number
          store_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
          product_id: number
          store_id: number
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
          product_id?: number
          store_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_option_map_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_option_map_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "store"
            referencedColumns: ["id"]
          },
        ]
      }
      product_option_combination_value_item: {
        Row: {
          created_at: string
          id: number
          option_combination_id: number
          option_id: number
          option_value_id: number
          product_id: number
          store_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          option_combination_id: number
          option_id: number
          option_value_id: number
          product_id: number
          store_id: number
        }
        Update: {
          created_at?: string
          id?: number
          option_combination_id?: number
          option_id?: number
          option_value_id?: number
          product_id?: number
          store_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_option_map_item_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "product_option"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_option_map_item_option_map_id_fkey"
            columns: ["option_combination_id"]
            isOneToOne: false
            referencedRelation: "product_option_combination"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_option_map_item_option_value_id_fkey"
            columns: ["option_value_id"]
            isOneToOne: false
            referencedRelation: "product_option_value"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_option_map_item_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_option_map_item_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "store"
            referencedColumns: ["id"]
          },
        ]
      }
      product_option_value: {
        Row: {
          created_at: string
          id: number
          label: string | null
          option_id: number
          product_id: number
          store_id: number
          value: string
        }
        Insert: {
          created_at?: string
          id?: number
          label?: string | null
          option_id: number
          product_id: number
          store_id: number
          value: string
        }
        Update: {
          created_at?: string
          id?: number
          label?: string | null
          option_id?: number
          product_id?: number
          store_id?: number
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "option_value_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "product_option"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "option_value_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "option_value_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "store"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variant: {
        Row: {
          compare_at_price: number | null
          created_at: string
          id: number
          inventory_management:
            | Database["grida_commerce"]["Enums"]["inventory_management"]
            | null
          inventory_policy:
            | Database["grida_commerce"]["Enums"]["inventory_policy"]
            | null
          price: number | null
          product_id: number
          product_option_combination_id: number | null
          sku: string
          store_id: number
        }
        Insert: {
          compare_at_price?: number | null
          created_at?: string
          id?: number
          inventory_management?:
            | Database["grida_commerce"]["Enums"]["inventory_management"]
            | null
          inventory_policy?:
            | Database["grida_commerce"]["Enums"]["inventory_policy"]
            | null
          price?: number | null
          product_id: number
          product_option_combination_id?: number | null
          sku: string
          store_id: number
        }
        Update: {
          compare_at_price?: number | null
          created_at?: string
          id?: number
          inventory_management?:
            | Database["grida_commerce"]["Enums"]["inventory_management"]
            | null
          inventory_policy?:
            | Database["grida_commerce"]["Enums"]["inventory_policy"]
            | null
          price?: number | null
          product_id?: number
          product_option_combination_id?: number | null
          sku?: string
          store_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_variant_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_variant_product_option_combination_id_fkey"
            columns: ["product_option_combination_id"]
            isOneToOne: true
            referencedRelation: "product_option_combination"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_variant_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "store"
            referencedColumns: ["id"]
          },
        ]
      }
      store: {
        Row: {
          created_at: string
          currency: Database["grida_commerce"]["Enums"]["currency"]
          id: number
          name: string
          project_id: number
        }
        Insert: {
          created_at?: string
          currency?: Database["grida_commerce"]["Enums"]["currency"]
          id?: number
          name: string
          project_id: number
        }
        Update: {
          created_at?: string
          currency?: Database["grida_commerce"]["Enums"]["currency"]
          id?: number
          name?: string
          project_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "store_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_option_combinations:
        | {
            Args: {
              p_store_id: number
              p_product_id: number
              p_option_values: string[]
            }
            Returns: undefined
          }
        | {
            Args: {
              p_store_id: number
              p_product_id: number
              p_option_values: Json
            }
            Returns: undefined
          }
      get_existing_option_values: {
        Args: {
          p_product_id: number
          p_exclude_option_id: number
        }
        Returns: {
          option_id: number
          value: string
        }[]
      }
      get_inventory_items_with_committed: {
        Args: {
          p_store_id: number
        }
        Returns: {
          id: number
          created_at: string
          sku: string
          store_id: number
          product_id: number
          variant_id: number
          cost: number
          available: number
          committed: number
        }[]
      }
      get_inventory_with_committed:
        | {
            Args: Record<PropertyKey, never>
            Returns: {
              id: number
              created_at: string
              sku: string
              store_id: number
              product_id: number
              variant_id: number
              cost: number
              available: number
              committed: number
            }[]
          }
        | {
            Args: {
              p_store_id: number
              p_sku: string
            }
            Returns: {
              id: number
              created_at: string
              sku: string
              store_id: number
              product_id: number
              variant_id: number
              cost: number
              available: number
              committed: number
            }[]
          }
    }
    Enums: {
      currency:
        | "AED"
        | "AFN"
        | "ALL"
        | "AMD"
        | "ANG"
        | "AOA"
        | "ARS"
        | "AUD"
        | "AWG"
        | "AZN"
        | "BAM"
        | "BBD"
        | "BDT"
        | "BGN"
        | "BHD"
        | "BIF"
        | "BMD"
        | "BND"
        | "BOB"
        | "BRL"
        | "BSD"
        | "BTC"
        | "BTN"
        | "BWP"
        | "BYN"
        | "BZD"
        | "CAD"
        | "CDF"
        | "CHF"
        | "CLF"
        | "CLP"
        | "CNH"
        | "CNY"
        | "COP"
        | "CRC"
        | "CUC"
        | "CUP"
        | "CVE"
        | "CZK"
        | "DJF"
        | "DKK"
        | "DOP"
        | "DZD"
        | "EGP"
        | "ERN"
        | "ETB"
        | "EUR"
        | "FJD"
        | "FKP"
        | "GBP"
        | "GEL"
        | "GGP"
        | "GHS"
        | "GIP"
        | "GMD"
        | "GNF"
        | "GTQ"
        | "GYD"
        | "HKD"
        | "HNL"
        | "HRK"
        | "HTG"
        | "HUF"
        | "IDR"
        | "ILS"
        | "IMP"
        | "INR"
        | "IQD"
        | "IRR"
        | "ISK"
        | "JEP"
        | "JMD"
        | "JOD"
        | "JPY"
        | "KES"
        | "KGS"
        | "KHR"
        | "KMF"
        | "KPW"
        | "KRW"
        | "KWD"
        | "KYD"
        | "KZT"
        | "LAK"
        | "LBP"
        | "LKR"
        | "LRD"
        | "LSL"
        | "LYD"
        | "MAD"
        | "MDL"
        | "MGA"
        | "MKD"
        | "MMK"
        | "MNT"
        | "MOP"
        | "MRU"
        | "MUR"
        | "MVR"
        | "MWK"
        | "MXN"
        | "MYR"
        | "MZN"
        | "NAD"
        | "NGN"
        | "NIO"
        | "NOK"
        | "NPR"
        | "NZD"
        | "OMR"
        | "PAB"
        | "PEN"
        | "PGK"
        | "PHP"
        | "PKR"
        | "PLN"
        | "PYG"
        | "QAR"
        | "RON"
        | "RSD"
        | "RUB"
        | "RWF"
        | "SAR"
        | "SBD"
        | "SCR"
        | "SDG"
        | "SEK"
        | "SGD"
        | "SHP"
        | "SLL"
        | "SOS"
        | "SRD"
        | "SSP"
        | "STN"
        | "SVC"
        | "SYP"
        | "SZL"
        | "THB"
        | "TJS"
        | "TMT"
        | "TND"
        | "TOP"
        | "TRY"
        | "TTD"
        | "TWD"
        | "TZS"
        | "UAH"
        | "UGX"
        | "USD"
        | "UYU"
        | "UZS"
        | "VES"
        | "VND"
        | "VUV"
        | "WST"
        | "XAF"
        | "XCD"
        | "XDR"
        | "XOF"
        | "XPF"
        | "YER"
        | "ZAR"
        | "ZMW"
        | "ZWL"
      inventory_level_commit_reason:
        | "admin"
        | "initialize"
        | "other"
        | "order"
        | "initialize_by_system"
      inventory_management: "none" | "system"
      inventory_policy: "continue" | "deny"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  grida_forms: {
    Tables: {
      connection_commerce_store: {
        Row: {
          created_at: string
          form_id: string
          id: number
          project_id: number
          store_id: number
        }
        Insert: {
          created_at?: string
          form_id: string
          id?: number
          project_id: number
          store_id: number
        }
        Update: {
          created_at?: string
          form_id?: string
          id?: number
          project_id?: number
          store_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "connection_commerce_store_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "store"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_connection_store_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: true
            referencedRelation: "form"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_connection_store_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project"
            referencedColumns: ["id"]
          },
        ]
      }
      form: {
        Row: {
          created_at: string
          custom_preview_url_path: string | null
          custom_publish_url_path: string | null
          default_form_page_id: string | null
          default_form_page_language: Database["grida_forms"]["Enums"]["form_page_language"]
          description: string | null
          ending_page_template_id: string | null
          id: string
          is_edit_after_submission_allowed: boolean
          is_ending_page_enabled: boolean
          is_force_closed: boolean
          is_max_form_responses_by_customer_enabled: boolean
          is_max_form_responses_in_total_enabled: boolean
          is_multiple_response_allowed: boolean
          is_powered_by_branding_enabled: boolean
          is_redirect_after_response_uri_enabled: boolean
          max_form_responses_by_customer: number | null
          max_form_responses_in_total: number | null
          project_id: number
          redirect_after_response_uri: string | null
          title: string
          unknown_field_handling_strategy: Database["grida_forms"]["Enums"]["form_response_unknown_field_handling_strategy_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          custom_preview_url_path?: string | null
          custom_publish_url_path?: string | null
          default_form_page_id?: string | null
          default_form_page_language?: Database["grida_forms"]["Enums"]["form_page_language"]
          description?: string | null
          ending_page_template_id?: string | null
          id?: string
          is_edit_after_submission_allowed?: boolean
          is_ending_page_enabled?: boolean
          is_force_closed?: boolean
          is_max_form_responses_by_customer_enabled?: boolean
          is_max_form_responses_in_total_enabled?: boolean
          is_multiple_response_allowed?: boolean
          is_powered_by_branding_enabled?: boolean
          is_redirect_after_response_uri_enabled?: boolean
          max_form_responses_by_customer?: number | null
          max_form_responses_in_total?: number | null
          project_id: number
          redirect_after_response_uri?: string | null
          title?: string
          unknown_field_handling_strategy?: Database["grida_forms"]["Enums"]["form_response_unknown_field_handling_strategy_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          custom_preview_url_path?: string | null
          custom_publish_url_path?: string | null
          default_form_page_id?: string | null
          default_form_page_language?: Database["grida_forms"]["Enums"]["form_page_language"]
          description?: string | null
          ending_page_template_id?: string | null
          id?: string
          is_edit_after_submission_allowed?: boolean
          is_ending_page_enabled?: boolean
          is_force_closed?: boolean
          is_max_form_responses_by_customer_enabled?: boolean
          is_max_form_responses_in_total_enabled?: boolean
          is_multiple_response_allowed?: boolean
          is_powered_by_branding_enabled?: boolean
          is_redirect_after_response_uri_enabled?: boolean
          max_form_responses_by_customer?: number | null
          max_form_responses_in_total?: number | null
          project_id?: number
          redirect_after_response_uri?: string | null
          title?: string
          unknown_field_handling_strategy?: Database["grida_forms"]["Enums"]["form_response_unknown_field_handling_strategy_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "grida_forms_form_default_form_page_id_fkey"
            columns: ["default_form_page_id"]
            isOneToOne: false
            referencedRelation: "form_page"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grida_forms_form_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project"
            referencedColumns: ["id"]
          },
        ]
      }
      form_block: {
        Row: {
          body_html: string | null
          created_at: string
          data: Json
          description_html: string | null
          form_field_id: string | null
          form_id: string
          form_page_id: string | null
          id: string
          local_index: number
          parent_id: string | null
          src: string | null
          title_html: string | null
          type: Database["grida_forms"]["Enums"]["form_block_type"]
          updated_at: string
        }
        Insert: {
          body_html?: string | null
          created_at?: string
          data: Json
          description_html?: string | null
          form_field_id?: string | null
          form_id: string
          form_page_id?: string | null
          id?: string
          local_index?: number
          parent_id?: string | null
          src?: string | null
          title_html?: string | null
          type: Database["grida_forms"]["Enums"]["form_block_type"]
          updated_at?: string
        }
        Update: {
          body_html?: string | null
          created_at?: string
          data?: Json
          description_html?: string | null
          form_field_id?: string | null
          form_id?: string
          form_page_id?: string | null
          id?: string
          local_index?: number
          parent_id?: string | null
          src?: string | null
          title_html?: string | null
          type?: Database["grida_forms"]["Enums"]["form_block_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "grida_forms_form_block_form_field_id_fkey"
            columns: ["form_field_id"]
            isOneToOne: false
            referencedRelation: "form_field"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grida_forms_form_block_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "form"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grida_forms_form_block_form_page_id_fkey"
            columns: ["form_page_id"]
            isOneToOne: false
            referencedRelation: "form_page"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grida_forms_form_block_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "form_block"
            referencedColumns: ["id"]
          },
        ]
      }
      form_editor_metadata: {
        Row: {
          form_id: string | null
          id: number
          project_id: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          form_id?: string | null
          id?: number
          project_id?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          form_id?: string | null
          id?: number
          project_id?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "grida_forms_editor_metadata_last_active_form_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "form"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grida_forms_editor_metadata_last_active_form_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grida_forms_editor_metadata_last_active_form_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      form_field: {
        Row: {
          accept: string | null
          alt: string | null
          autocomplete:
            | Database["grida_forms"]["Enums"]["form_field_autocomplete_type"][]
            | null
          created_at: string
          data: Json | null
          description: string | null
          form_id: string
          help_text: string | null
          id: string
          label: string | null
          max: Json | null
          maxlength: number | null
          min: Json | null
          minlength: number | null
          multiple: boolean | null
          name: string
          pattern: Json | null
          placeholder: string | null
          required: boolean
          type: Database["grida_forms"]["Enums"]["form_field_type"]
          updated_at: string
        }
        Insert: {
          accept?: string | null
          alt?: string | null
          autocomplete?:
            | Database["grida_forms"]["Enums"]["form_field_autocomplete_type"][]
            | null
          created_at?: string
          data?: Json | null
          description?: string | null
          form_id: string
          help_text?: string | null
          id?: string
          label?: string | null
          max?: Json | null
          maxlength?: number | null
          min?: Json | null
          minlength?: number | null
          multiple?: boolean | null
          name: string
          pattern?: Json | null
          placeholder?: string | null
          required?: boolean
          type?: Database["grida_forms"]["Enums"]["form_field_type"]
          updated_at?: string
        }
        Update: {
          accept?: string | null
          alt?: string | null
          autocomplete?:
            | Database["grida_forms"]["Enums"]["form_field_autocomplete_type"][]
            | null
          created_at?: string
          data?: Json | null
          description?: string | null
          form_id?: string
          help_text?: string | null
          id?: string
          label?: string | null
          max?: Json | null
          maxlength?: number | null
          min?: Json | null
          minlength?: number | null
          multiple?: boolean | null
          name?: string
          pattern?: Json | null
          placeholder?: string | null
          required?: boolean
          type?: Database["grida_forms"]["Enums"]["form_field_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "grida_forms_form_field_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "form"
            referencedColumns: ["id"]
          },
        ]
      }
      form_field_option: {
        Row: {
          created_at: string
          disabled: boolean | null
          form_field_id: string
          form_id: string
          id: string
          index: number
          label: string
          value: string
        }
        Insert: {
          created_at?: string
          disabled?: boolean | null
          form_field_id: string
          form_id: string
          id?: string
          index?: number
          label?: string
          value: string
        }
        Update: {
          created_at?: string
          disabled?: boolean | null
          form_field_id?: string
          form_id?: string
          id?: string
          index?: number
          label?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "grida_forms_form_field_option_form_field_id_fkey"
            columns: ["form_field_id"]
            isOneToOne: false
            referencedRelation: "form_field"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grida_forms_form_field_option_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "form"
            referencedColumns: ["id"]
          },
        ]
      }
      form_page: {
        Row: {
          background: Json | null
          created_at: string
          form_id: string
          id: string
          name: string
          stylesheet: Json | null
        }
        Insert: {
          background?: Json | null
          created_at?: string
          form_id: string
          id?: string
          name?: string
          stylesheet?: Json | null
        }
        Update: {
          background?: Json | null
          created_at?: string
          form_id?: string
          id?: string
          name?: string
          stylesheet?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "grida_forms_form_page_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "form"
            referencedColumns: ["id"]
          },
        ]
      }
      response: {
        Row: {
          browser: string | null
          created_at: string
          customer_id: string | null
          form_id: string | null
          id: string
          ip: string | null
          local_id: number
          platform_powered_by:
            | Database["grida_forms"]["Enums"]["response_platform_powered_by"]
            | null
          raw: Json
          updated_at: string
          x_referer: string | null
          x_useragent: string | null
        }
        Insert: {
          browser?: string | null
          created_at?: string
          customer_id?: string | null
          form_id?: string | null
          id?: string
          ip?: string | null
          local_id?: number
          platform_powered_by?:
            | Database["grida_forms"]["Enums"]["response_platform_powered_by"]
            | null
          raw: Json
          updated_at?: string
          x_referer?: string | null
          x_useragent?: string | null
        }
        Update: {
          browser?: string | null
          created_at?: string
          customer_id?: string | null
          form_id?: string | null
          id?: string
          ip?: string | null
          local_id?: number
          platform_powered_by?:
            | Database["grida_forms"]["Enums"]["response_platform_powered_by"]
            | null
          raw?: Json
          updated_at?: string
          x_referer?: string | null
          x_useragent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "grida_forms_response_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "grida_forms_response_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "form"
            referencedColumns: ["id"]
          },
        ]
      }
      response_field: {
        Row: {
          created_at: string
          form_field_id: string
          form_field_option_id: string | null
          form_id: string | null
          id: string
          response_id: string
          type: Database["grida_forms"]["Enums"]["form_field_type"]
          updated_at: string
          value: Json | null
        }
        Insert: {
          created_at?: string
          form_field_id: string
          form_field_option_id?: string | null
          form_id?: string | null
          id?: string
          response_id: string
          type?: Database["grida_forms"]["Enums"]["form_field_type"]
          updated_at?: string
          value?: Json | null
        }
        Update: {
          created_at?: string
          form_field_id?: string
          form_field_option_id?: string | null
          form_id?: string | null
          id?: string
          response_id?: string
          type?: Database["grida_forms"]["Enums"]["form_field_type"]
          updated_at?: string
          value?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "grida_forms_response_field_form_field_id_fkey"
            columns: ["form_field_id"]
            isOneToOne: false
            referencedRelation: "form_field"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grida_forms_response_field_form_field_option_id_fkey"
            columns: ["form_field_option_id"]
            isOneToOne: false
            referencedRelation: "form_field_option"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grida_forms_response_field_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "form"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grida_forms_response_field_response_id_fkey"
            columns: ["response_id"]
            isOneToOne: false
            referencedRelation: "response"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      form_block_type:
        | "section"
        | "group"
        | "field"
        | "html"
        | "image"
        | "video"
        | "divider"
        | "header"
        | "pdf"
      form_field_autocomplete_type:
        | "off"
        | "on"
        | "name"
        | "honorific-prefix"
        | "given-name"
        | "additional-name"
        | "family-name"
        | "honorific-suffix"
        | "nickname"
        | "email"
        | "username"
        | "new-password"
        | "current-password"
        | "one-time-code"
        | "organization-title"
        | "organization"
        | "street-address"
        | "shipping"
        | "billing"
        | "address-line1"
        | "address-line2"
        | "address-line3"
        | "address-level4"
        | "address-level3"
        | "address-level2"
        | "address-level1"
        | "country"
        | "country-name"
        | "postal-code"
        | "cc-name"
        | "cc-given-name"
        | "cc-additional-name"
        | "cc-family-name"
        | "cc-number"
        | "cc-exp"
        | "cc-exp-month"
        | "cc-exp-year"
        | "cc-csc"
        | "cc-type"
        | "transaction-currency"
        | "transaction-amount"
        | "language"
        | "bday"
        | "bday-day"
        | "bday-month"
        | "bday-year"
        | "sex"
        | "tel"
        | "tel-country-code"
        | "tel-national"
        | "tel-area-code"
        | "tel-local"
        | "tel-extension"
        | "impp"
        | "url"
        | "photo"
        | "webauthn"
      form_field_type:
        | "text"
        | "textarea"
        | "tel"
        | "url"
        | "checkbox"
        | "checkboxes"
        | "date"
        | "month"
        | "week"
        | "email"
        | "file"
        | "image"
        | "select"
        | "latlng"
        | "password"
        | "color"
        | "radio"
        | "country"
        | "payment"
        | "hidden"
        | "signature"
        | "number"
        | "time"
        | "datetime-local"
      form_page_language:
        | "en"
        | "ko"
        | "es"
        | "de"
        | "ja"
        | "fr"
        | "pt"
        | "it"
        | "ru"
        | "zh"
        | "ar"
        | "hi"
        | "nl"
      form_response_unknown_field_handling_strategy_type:
        | "ignore"
        | "accept"
        | "reject"
      response_platform_powered_by: "api" | "grida_forms" | "web_client"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      customer: {
        Row: {
          _fp_fingerprintjs_visitorid: string | null
          created_at: string
          email: string | null
          is_email_verified: boolean
          is_phone_verified: boolean
          last_seen_at: string
          phone: string | null
          project_id: number
          uid: string
          uuid: string | null
        }
        Insert: {
          _fp_fingerprintjs_visitorid?: string | null
          created_at?: string
          email?: string | null
          is_email_verified?: boolean
          is_phone_verified?: boolean
          last_seen_at?: string
          phone?: string | null
          project_id: number
          uid?: string
          uuid?: string | null
        }
        Update: {
          _fp_fingerprintjs_visitorid?: string | null
          created_at?: string
          email?: string | null
          is_email_verified?: boolean
          is_phone_verified?: boolean
          last_seen_at?: string
          phone?: string | null
          project_id?: number
          uid?: string
          uuid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_customer_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project"
            referencedColumns: ["id"]
          },
        ]
      }
      organization: {
        Row: {
          created_at: string
          id: number
          name: string
          owner_id: string
          uuid: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          owner_id?: string
          uuid?: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          owner_id?: string
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_organization_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_member: {
        Row: {
          created_at: string
          id: number
          organization_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          organization_id: number
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: number
          organization_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_organization_member_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_organization_member_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      project: {
        Row: {
          created_at: string
          id: number
          name: string
          organization_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          organization_id: number
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          organization_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_project_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_new_combination_maps: {
        Args: {
          new_store_id: number
          new_product_id: number
          new_option_id: number
          new_value_id: number
          new_value_text: string
        }
        Returns: undefined
      }
      create_single_option_map: {
        Args: {
          new_store_id: number
          new_product_id: number
          new_option_id: number
          new_option_value_id: number
          value_name: string
        }
        Returns: number
      }
      extend_existing_map_with_new_value:
        | {
            Args: {
              new_store_id: number
              new_product_id: number
              new_option_id: number
              new_value_id: number
              new_value_text: string
            }
            Returns: undefined
          }
        | {
            Args: {
              product_id: number
              new_option_id: number
              new_value_id: number
              new_value_text: string
            }
            Returns: undefined
          }
      get_organizations_for_user: {
        Args: {
          user_id: string
        }
        Returns: number[]
      }
      get_projects_for_user: {
        Args: {
          user_id: string
        }
        Returns: number[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
