'use client'

import { useMemo } from 'react'
import Link from 'next/link'

import ThemeSwitcher from '@/components/ThemeSwitcher'
import LoginDialog from '@/components/LoginDialog'
import { Button } from '@/components/ui/button'

import { useSupabase } from '@/contexts/SupabaseContext'

export default function Header() {
  const { user, handleLogout } = useSupabase()

  const isLoggedIn = useMemo(() => {
    if (!user) return false
    return true
  }, [user])

  return (
    <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center">
        <div className="mr-4 md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold sm:inline-block">Stockfolio1</span>
          </Link>
          {/* <nav className="md:flex hidden items-center space-x-6 text-sm font-medium">
            <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground/80">
              Dashboard
            </Link>
          </nav> */}
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
