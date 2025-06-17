import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          dni: string
          nombre: string
          rol: "admin" | "usuario"
          es_vegetariano: boolean
          es_celiaco: boolean
          enfermedades: string | null
          created_at: string
        }
        Insert: {
          dni: string
          nombre: string
          rol?: "admin" | "usuario"
          es_vegetariano?: boolean
          es_celiaco?: boolean
          enfermedades?: string | null
        }
        Update: {
          dni?: string
          nombre?: string
          rol?: "admin" | "usuario"
          es_vegetariano?: boolean
          es_celiaco?: boolean
          enfermedades?: string | null
        }
      }
      menus: {
        Row: {
          id: string
          fecha: string
          estado: "confirmado" | "a confirmar"
          created_at: string
        }
        Insert: {
          fecha: string
          estado?: "confirmado" | "a confirmar"
        }
        Update: {
          fecha?: string
          estado?: "confirmado" | "a confirmar"
        }
      }
      platos: {
        Row: {
          id: string
          menu_id: string
          tipo: "vegetariano" | "celiaco" | "general"
          nombre: string
          descripcion: string | null
          created_at: string
        }
        Insert: {
          menu_id: string
          tipo: "vegetariano" | "celiaco" | "general"
          nombre: string
          descripcion?: string | null
        }
        Update: {
          menu_id?: string
          tipo?: "vegetariano" | "celiaco" | "general"
          nombre?: string
          descripcion?: string | null
        }
      }
      reservas: {
        Row: {
          id: string
          user_id: string
          plato_id: string
          fecha: string
          created_at: string
        }
        Insert: {
          user_id: string
          plato_id: string
          fecha: string
        }
        Update: {
          user_id?: string
          plato_id?: string
          fecha?: string
        }
      }
    }
  }
}
