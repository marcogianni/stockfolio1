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

export interface UserStock {
  id: number
  symbol: string
  currency: string
  exchange: string
  instrument_name: string
  quantity: number
  purchase_price: number
  current_price: number
}

export type UserSession = {
  supabase: SupabaseClient<Database>
  userSession: Session | null
  user: User | null
}
