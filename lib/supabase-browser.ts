import { Database } from '@/lib/database.types'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const createClient = () => createClientComponentClient<Database>()
