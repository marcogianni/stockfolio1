'use client'

import { getCurrencyExchange } from '@/api/freecurrencyapi'
import { createContext, useEffect, useState, useContext } from 'react'

type ExchangeRate = Record<string, number>

export const ExchangeRatesContext = createContext({} as { rates: ExchangeRate })

export const ExchangeRatesProvider = ({ children }: { children: React.ReactNode }) => {
  const [rates, setRates] = useState({})

  useEffect(() => {
    const getRates = async () => {
      try {
        const response = await getCurrencyExchange()
        setRates(response?.data)
      } catch (err) {
        console.error('Error fetching exchange rates')
      }
    }
    getRates()
  }, [])
  return <ExchangeRatesContext.Provider value={{ rates }}>{children}</ExchangeRatesContext.Provider>
}

export const useExchangeRates = () => {
  const context = useContext(ExchangeRatesContext)

  if (context === undefined) {
    throw new Error('useExchangeRates must be used within a ExchangeRatesContext')
  }

  return context
}
