'use client'

import { useMemo } from 'react'
import Link from 'next/link'

import ThemeSwitcher from '@/components/ThemeSwitcher'
import LoginDialog from '@/components/LoginDialog'
import { Button } from '@/components/ui/button'

import { useSupabase } from '@/contexts/SupabaseContext'
import { PersonIcon } from '@radix-ui/react-icons'

import type { Database } from '@/lib/database.types'

export default function Header() {
  const { supabase, user } = useSupabase()
  console.debug('Header', { user })

  const isLoggedIn = useMemo(() => ![undefined, null].includes(user?.email), [user])

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
  }

  return (
    <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">Stockfolio</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/dashboard" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Dashboard
            </Link>
            <Link href="/diversification" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Diversification
            </Link>
            <Link href="/upcoming" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Upcoming Dividends
            </Link>
            <Link href="/future" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Future Value
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <ThemeSwitcher />

          {isLoggedIn ? (
            <>
              <Button variant="outline" size="icon">
                <PersonIcon />
              </Button>
              <Button onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <LoginDialog />
          )}
        </div>
      </div>
    </header>
  )
}
