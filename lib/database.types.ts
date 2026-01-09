export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      registrations: {
        Row: {
          id: number
          created_at: string
          name: string
          age_group: string
          gender: string
          village: string
          phone: string
          requests: string | null
          attendance_type: 'full' | 'partial'
          attendance_dates: string[] | null
          transport_type: string
          departure_info: string | null
          return_info: string | null
          total_cost: number
          status: string
        }
        Insert: {
          id?: number
          created_at?: string
          name: string
          age_group: string
          gender: string
          village: string
          phone: string
          requests?: string | null
          attendance_type: 'full' | 'partial'
          attendance_dates?: string[] | null
          transport_type: string
          departure_info?: string | null
          return_info?: string | null
          total_cost: number
          status?: string
        }
        Update: {
          id?: number
          created_at?: string
          name?: string
          age_group?: string
          gender?: string
          village?: string
          phone?: string
          requests?: string | null
          attendance_type?: 'full' | 'partial'
          attendance_dates?: string[] | null
          transport_type?: string
          departure_info?: string | null
          return_info?: string | null
          total_cost?: number
          status?: string
        }
      }
    }
  }
}
