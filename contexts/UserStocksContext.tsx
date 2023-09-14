'use client'

import { createContext, useEffect, useReducer, useContext, useMemo } from 'react'
import { useSupabase } from '@/contexts/SupabaseContext'
import { timeSeries } from '@/api/twelvedata'
import { number } from 'zod'

interface Serie {
  open: number
}

interface UserStock {
  id: number
  symbol: string
  currency: string
  exchange: string
  instrument_name: string
  quantity: number
  purchase_price: number
}

type UserStocksContextType = {
  series: Serie[]
  stocks: UserStock[]
  actions: {
    setSeries: (payload: Serie[]) => void
    setStocks: (payload: UserStock[]) => void
    addStock: (payload: UserStock) => void
  }
  data: {
    portfolioBalance: number
  }
}

export const UserStocksContext = createContext({} as UserStocksContextType)

const initialState = {
  series: [],
  stocks: [],
  interval: '1month',
}

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

export const UserStocksProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { supabase, user } = useSupabase()

  console.debug('Rendering UserStocksProvider', { state, user })

  const portfolioBalance = useMemo(
    () =>
      state.stocks.reduce((acc: number, stock: UserStock) => {
        return acc + stock.quantity * stock.purchase_price
      }, 0),
    [state.stocks]
  )

  useEffect(() => {
    const loadStocks = async () => {
      if (!user) return
      const { data } = await supabase.from('user_stocks').select('*').eq('user_id', user?.id)
      console.debug('loadStocks', data)
      dispatch({ type: 'SET_STOCKS', payload: data })
    }

    loadStocks()
  }, [user?.id])

  useEffect(() => {
    const loadSeries = async () => {
      const promises = state.stocks.map(async (stock: UserStock) => {
        const { values } = await timeSeries(stock.symbol, state.interval)
        return values
      })
      const series = await Promise.all(promises)
      dispatch({ type: 'SET_SERIES', payload: series })
    }
    loadSeries()
  }, [state.stocks, state.interval])

  const actions = {
    setSeries: (payload: Serie[]) => dispatch({ type: 'SET_SERIES', payload }),
    setStocks: (payload: UserStock[]) => dispatch({ type: 'SET_STOCKS', payload }),
    addStock: (payload: UserStock) => dispatch({ type: 'ADD_STOCK', payload }),
  }

  const data = {
    portfolioBalance,
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
