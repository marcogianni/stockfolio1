/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase-browser'
import { UserSession } from '@/lib/types'

const Context = createContext({} as UserSession)

export function SupabaseProvider({ children, userSession }: { children: React.ReactNode; userSession: Session | null }) {
  const [supabase] = useState(() => createClient())
  const [session, setSession] = useState<Session | null>(userSession)
  const [user, setUser] = useState<User | null>(userSession?.user ?? null)

  console.debug('SupabaseProvider', { supabase, userSession, user })

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(userSession?.user ?? null)
    })

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`Supabase onAuthStateChange: ${event}`)
      if (event === 'INITIAL_SESSION') return
      if (event === 'SIGNED_OUT') {
        setSession(null)
        setUser(null)
        return
      }
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session)
        setUser(userSession?.user ?? null)
      })
    })

    return () => {
      authListener.subscription
    }
  }, [])

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    console.debug('handleLogout', error)
  }

  const supa: UserSession = {
    supabase,
    userSession: session,
    user: session?.user ?? null,
    handleLogout,
  }

  const actions = {}

  return <Context.Provider value={supa}>{children}</Context.Provider>
}

export const useSupabase = () => {
  const context = useContext(Context)

  if (context === undefined) {
    throw new Error('useSupabase must be used inside a SupabaseProvider')
  }

  return context
}
