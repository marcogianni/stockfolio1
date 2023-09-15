'use client'

import { useMemo } from 'react'
import Link from 'next/link'

import ThemeSwitcher from '@/components/ThemeSwitcher'
import LoginDialog from '@/components/LoginDialog'
import { Button } from '@/components/ui/button'
import { PersonIcon } from '@radix-ui/react-icons'

import { useSupabase } from '@/contexts/SupabaseContext'

export default function Header() {
  const { user, handleLogout } = useSupabase()
  console.debug('Header', { user })

  const isLoggedIn = useMemo(() => {
    if (!user) return false
    return true
  }, [user])

  return (
    <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center">
        <div className="mr-4 md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold sm:inline-block">Stockfolio</span>
          </Link>
          <nav className="md:flex hidden items-center space-x-6 text-sm font-medium">
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

        <div className="flex flex-1 items-center space-x-2 justify-end">
          <ThemeSwitcher />

          {isLoggedIn ? (
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <LoginDialog />
          )}
        </div>
      </div>
    </header>
  )
}
