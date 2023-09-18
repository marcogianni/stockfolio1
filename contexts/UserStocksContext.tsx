'use client'

import { createContext, useEffect, useReducer, useContext, useMemo } from 'react'
import { useSupabase } from '@/contexts/SupabaseContext'
import { timeSeries } from '@/api/twelvedata'
import { LastPrice, Serie, UserStock, SupabaseStock } from '@/lib/types'
import { getSeriesLastPrice, marshalTwelveDataSeries, stocksWithCurrentPrice } from '@/lib/utils'

type UserStocksContextType = {
  series: Serie[]
  stocks: UserStock[]
  actions: {
    setSeries: (payload: Serie[]) => void
    setStocks: (payload: UserStock[]) => void
    addStock: (payload: UserStock) => void
    loadStocks: () => void
    deleteStock: (payload: UserStock) => void
  }
  data: {
    totalInvested: number
    portfolioValue: number
    profitLoss: string
  }
  exchangeRates: {}
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
      return {
        ...state,
        stocks: state.stocks.filter((stock: UserStock) => stock.id !== action.payload.id),
        series: state.series.filter((serie: Serie) => serie.symbol !== action.payload.symbol),
      }
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
          const currentPrice = stock?.current_price ?? 0
          return acc + stock.quantity * currentPrice
        }, 0)
        .toFixed(2),
    [state.stocks]
  )

  const profitLoss: string = useMemo(
    () => (Number((portfolioValue - totalInvested) / totalInvested) * 100).toFixed(2),
    [totalInvested, portfolioValue]
  )

  const loadStocks = async () => {
    if (!user) return
    // Get all stocks for the current user
    const { data } = await supabase.from('user_stocks').select('*').eq('user_id', user?.id)

    if (data) {
      // Get the series for each stock
      const series: Serie[] = await loadSeries(data)
      // Get the last price for each stock searching close price from the last serie
      const lastPriceSeries: LastPrice[] = getSeriesLastPrice(series)
      // Combine the stocks with the last price
      const stocksWithPrice = stocksWithCurrentPrice(lastPriceSeries, data)

      dispatch({ type: 'SET_STOCKS', payload: stocksWithPrice })
      dispatch({ type: 'SET_SERIES', payload: series })
    }
  }

  const loadSeries = async (stocks: SupabaseStock[]) => {
    // Get the series for each stock
    const promises = stocks.map(async (stock: SupabaseStock) => {
      const { values } = await timeSeries(stock.symbol, state.interval)
      return { symbol: stock.symbol, data: values ?? null }
    })

    const series: Serie[] = await Promise.all(promises)
    const cleanedSeries = marshalTwelveDataSeries(series)
    return cleanedSeries
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
    deleteStock: (payload: UserStock) => dispatch({ type: 'DELETE_STOCK', payload }),
    loadStocks,
  }

  const data = {
    totalInvested,
    portfolioValue,
    profitLoss,
  }

  return (
    <UserStocksContext.Provider value={{ series: state.series, stocks: state.stocks, exchangeRates: state.exchangeRates, actions, data }}>
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
