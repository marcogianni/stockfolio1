'use client'

import { createContext, useEffect, useReducer, useContext, useMemo } from 'react'
import { useSupabase } from '@/contexts/SupabaseContext'
import { timeSeries, endOfDatePrice } from '@/api/twelvedata'
import { Serie, Stock, UserStock } from '@/lib/types'

type UserStocksContextType = {
  series: Serie[]
  stocks: UserStock[]
  actions: {
    setSeries: (payload: Serie[]) => void
    setStocks: (payload: UserStock[]) => void
    addStock: (payload: UserStock) => void
    loadStocks: () => void
  }
  data: {
    totalInvested: number
    portfolioValue: number
    profitLoss: string
  }
}

export const UserStocksContext = createContext({} as UserStocksContextType)

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'RESET': {
      return initialState
    }
    case 'SET_SERIES':
      return { ...state, series: action.payload }
    case 'SET_STOCKS':
      return { ...state, stocks: action.payload }
    case 'ADD_STOCK':
      return { ...state, stocks: [...state.stocks, action.payload] }
    case 'DELETE_STOCK':
      return { ...state, stocks: state.stocks.filter((stock: UserStock) => stock.id !== action.payload) }
    case 'SET_INTERVAL':
      return { ...state, interval: action.payload }

    default:
      return state
  }
}

const initialState = {
  series: [],
  stocks: [],
  interval: '1month',
}

export const UserStocksProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { supabase, user } = useSupabase()

  const totalInvested: number = useMemo(
    () =>
      state.stocks
        .reduce((acc: number, stock: UserStock) => {
          return acc + stock.quantity * stock.purchase_price
        }, 0)
        .toFixed(2),
    [state.stocks]
  )

  const portfolioValue: number = useMemo(
    () =>
      state.stocks
        .reduce((acc: number, stock: UserStock) => {
          return acc + stock.quantity * stock.current_price
        }, 0)
        .toFixed(2),
    [state.stocks]
  )

  const profitLoss: string = useMemo(
    () => (Number((portfolioValue - totalInvested) / totalInvested) * 100).toFixed(2),
    [totalInvested, portfolioValue]
  )

  const loadStocks = async () => {
    // TODO IMPROVEMENT: check if the user has already the stocks SERIES loaded
    if (!user) return
    // Get all stocks for the current user
    const { data } = await supabase.from('user_stocks').select('*').eq('user_id', user?.id)

    if (data) {
      // Get the series for each stock
      const series = await loadSeries(data)
      // Get the last price for each stock searching close price from the last serie
      const lastPriceSeries = series.map((serie: Serie) => {
        const length = serie.data.length
        const lastPrice: number = Number(serie.data[length - 1]?.close)
        return { symbol: serie.symbol, lastPrice }
      })

      // Combine the stocks with the last price
      const combinedStocks = data.map((stock: UserStock) => {
        const lastPrice = lastPriceSeries.find((serie) => serie.symbol === stock.symbol)?.lastPrice
        return { ...stock, current_price: lastPrice }
      })

      dispatch({ type: 'SET_STOCKS', payload: combinedStocks })
      dispatch({ type: 'SET_SERIES', payload: series })
    }
  }

  const loadSeries = async (stocks: UserStock[]) => {
    // Get the series for each stock
    const promises = stocks.map(async (stock: UserStock) => {
      const { values } = await timeSeries(stock.symbol, state.interval)
      return { symbol: stock.symbol, data: values ?? null }
    })

    let series: Serie[] = await Promise.all(promises)
    const minLength = Math.min(...series.map((serie) => serie?.data?.length))
    // keep series with the same length
    series = series.map((serie) => ({ ...serie, data: serie?.data?.slice(0, minLength) }))
    let sortedSeries: Serie[] = series.map((serie: Serie) => ({ symbol: serie.symbol, data: serie.data.reverse() }))
    return sortedSeries
  }

  useEffect(() => {
    if (!user) {
      dispatch({ type: 'RESET' })
      return
    }
    loadStocks()
  }, [user?.id])

  const actions = {
    setSeries: (payload: Serie[]) => dispatch({ type: 'SET_SERIES', payload }),
    setStocks: (payload: UserStock[]) => dispatch({ type: 'SET_STOCKS', payload }),
    addStock: (payload: UserStock) => dispatch({ type: 'ADD_STOCK', payload }),
    loadStocks,
  }

  const data = {
    totalInvested,
    portfolioValue,
    profitLoss,
  }

  return (
    <UserStocksContext.Provider value={{ series: state.series, stocks: state.stocks, actions, data }}>
      {children}
    </UserStocksContext.Provider>
  )
}

export const useUserStocks = () => {
  const context = useContext(UserStocksContext)

  if (context === undefined) {
    throw new Error('useUserStocks must be used within a UserStocksProvider')
  }

  return context
}
