import { Session, User } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/lib/database.types'

export interface Serie {
  symbol: string
  data: TimeSeries[]
}

export interface TimeSeries {
  open: number
  close: number
  high: number
  low: number
  datetime: string
  volume: number
}

export interface LastPrice {
  symbol: string
  lastPrice: number
}

export type UserSession = {
  supabase: SupabaseClient<Database>
  userSession: Session | null
  user: User | null
  handleLogout: () => void
}

export type SupabaseStock = {
  created_at: string
  exchange: string
  id: number
  instrument_name: string
  mic_code: string
  purchase_price: number
  quantity: number
  symbol: string
  updated_at: string
  currency: string
  user_id: string
}

export interface UserStock {
  id: number
  user_id: string
  symbol: string
  currency: string
  exchange: string
  instrument_name: string
  quantity: number
  purchase_price: number
  current_price: number
  mic_code: string
}
