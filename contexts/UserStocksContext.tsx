'use client'

import { createContext, useEffect, useReducer, useContext, useMemo } from 'react'
import { useSupabase } from '@/contexts/SupabaseContext'
import { timeSeries, endOfDatePrice } from '@/api/twelvedata'
import { Serie, UserStock } from '@/lib/types'

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

  console.debug('Rendering UserStocksProvider', { state, user })

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
    if (!user) return
    // Get all stocks for the current user
    const { data } = await supabase.from('user_stocks').select('*').eq('user_id', user?.id)

    if (data) {
      // Get the current price for each stock
      const promises = data.map(async (stock: UserStock) => {
        return await endOfDatePrice(stock.symbol)
      })

      const result = await Promise.all(promises)

      console.debug('loadStocks', result)

      // Merge it with the stock object
      const updatedStocks = data.map((stock: UserStock) => {
        const price = result.find((price) => price.symbol === stock.symbol)
        return { ...stock, current_price: Number(price?.close) }
      })

      dispatch({ type: 'SET_STOCKS', payload: updatedStocks })
    }
  }

  useEffect(() => {
    loadStocks()
  }, [user?.id])

  useEffect(() => {
    const loadSeries = async () => {
      // Get the series for each stock
      const promises = state.stocks.map(async (stock: UserStock) => {
        const { values } = await timeSeries(stock.symbol, state.interval)
        return { symbol: stock.symbol, data: values }
      })

      let series: Serie[] = await Promise.all(promises)
      let sortedSeries: Serie[] = series.map((serie: Serie) => ({ symbol: serie.symbol, data: serie.data.reverse() }))

      /*
       const minLength = Math.min(...series.map((serie) => serie.data.length))
      sortedSeries = sortedSeries.map((serie) => (serie.data = serie.data.slice(0, minLength)))
      // in this case sortedSeries could have different array size of serie.data, so we need to find the min length and slice the array to that length
      */

      dispatch({ type: 'SET_SERIES', payload: sortedSeries })
    }
    loadSeries()
  }, [state.stocks, state.interval])

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
