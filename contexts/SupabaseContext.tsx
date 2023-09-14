/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase-browser'
import { UserSession } from '@/lib/types'

const Context = createContext({} as UserSession)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createClient())
  const [userSession, setUserSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)

  console.debug('SupabaseProvider')

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
