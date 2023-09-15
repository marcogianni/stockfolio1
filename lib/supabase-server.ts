import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies, headers } from 'next/headers'
import 'server-only'

import { Database } from '@/lib/database.types'

export const createClient = () => createServerComponentClient<Database>({ cookies })
