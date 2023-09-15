/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase-browser'
import { UserSession } from '@/lib/types'

const Context = createContext({} as UserSession)

export function SupabaseProvider({ children, userSession }: { children: React.ReactNode; userSession: Session | null }) {
  const [supabase] = useState(() => createClient())
  const [user, setUser] = useState<User | null>(userSession?.user ?? null)

  console.debug('SupabaseProvider', { supabase, userSession, user })

  useEffect(() => {
    if (!userSession) return
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(userSession?.user ?? null)
    })

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`Supabase onAuthStateChange: ${event}`)
      if (event === 'INITIAL_SESSION') return
      setUser(userSession?.user ?? null)
    })

    return () => {
      authListener.subscription
    }
  }, [])

  const supa: UserSession = {
    supabase,
    userSession,
    user: userSession?.user ?? null,
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
