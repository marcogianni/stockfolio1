/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { SupabaseClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/lib/database.types'
import { Session, User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase-browser'

type UserSession = {
  supabase: SupabaseClient<Database>
  userSession: Session | null
  user: User | null
}

const Context = createContext(undefined)

const supabase = createClient()

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [userSession, setUserSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserSession(session)
      setUser(session?.user ?? null)
    })

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`Supabase onAuthStateChange: ${event}`)
      if (event === 'INITIAL_SESSION') return
      setUserSession(session)
      setUser(session?.user ?? null)
    })

    return () => {
      authListener.subscription
    }
  }, [])

  const supa: UserSession = {
    supabase,
    userSession,
    user,
  }

  return <Context.Provider value={supa}>{children}</Context.Provider>
}

export const useSupabase = () => {
  const context = useContext(Context)

  if (context === undefined) {
    throw new Error('useSupabase must be used inside a SupabaseProvider')
  }

  return context
}
