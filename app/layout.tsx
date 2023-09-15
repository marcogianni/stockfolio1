import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { ThemeProvider } from '@/components/ThemeProvider'
import Header from '@/components/Header'
import { Toaster } from '@/components/ui/toaster'
import SplashScreenWrapper from '@/components/splash/SplashScreenWrapper'
import { SupabaseProvider } from '@/contexts/SupabaseContext'
import { UserStocksProvider } from '@/contexts/UserStocksContext'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

import { cookies } from 'next/headers'
import { Database } from '@/lib/database.types'

const inter = Inter({ subsets: ['latin'] })

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Stockfolio',
  description: 'Generated by create next app',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerComponentClient<Database>({ cookies })
  const { data, error } = await supabase.auth.getSession()
  const session = data?.session ?? null

  console.debug('RootLayout', session)
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SplashScreenWrapper>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <SupabaseProvider userSession={session}>
              <UserStocksProvider>
                <Header />
                {children}
              </UserStocksProvider>
            </SupabaseProvider>
            <Toaster />
          </ThemeProvider>
        </SplashScreenWrapper>
      </body>
    </html>
  )
}
