'use client'

import { getCurrencyExchange } from '@/api/freecurrencyapi'
import { createContext, useEffect, useState } from 'react'

type ExchangeRatesContextType = {
  [currency: string]: number
}

export const ExchangeRatesContext = createContext({} as ExchangeRatesContextType)

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
  return <ExchangeRatesContext.Provider value={{}}>{children}</ExchangeRatesContext.Provider>
}
