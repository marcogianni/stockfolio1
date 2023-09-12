'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { SupabaseClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/lib/database.types'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

type SupabaseContext = {
  supabase: SupabaseClient<Database>
}

const Context = createContext<SupabaseContext | undefined>(undefined)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createClient())
  const [user, setUser] = useState(null)
  const router = useRouter()

  console.debug('SupabaseProvider.supabase', { supabase, user })

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.debug('onAuthStateChange', { event, session })
      //   router.refresh()
    })

    const loadUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      console.log('User', data.user)
      if (data?.user) {
        setUser(data?.user)
        router.push('/dashboard')
      }
    }

    loadUser()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return <Context.Provider value={{ supabase }}>{children}</Context.Provider>
}

export const useSupabase = () => {
  const context = useContext(Context)

  if (context === undefined) {
    throw new Error('useSupabase must be used inside a SupabaseProvider')
  }

  return context
}
