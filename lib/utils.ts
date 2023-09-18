import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { LastPrice, Serie, SupabaseStock, UserStock } from '@/lib/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function debounce<T extends (...args: any) => any>(func: T, timeout = 500) {
  let timer: NodeJS.Timeout | undefined
  return (...args: any) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func(...args)
    }, timeout)
  }
}

// Keep series with the same length
export function marshalTwelveDataSeries(series: Serie[]): Serie[] {
  const minLength = Math.min(...series.map((serie) => serie?.data?.length))
  // keep series with the same length
  series = series.map((serie) => ({ ...serie, data: serie?.data?.slice(0, minLength) }))
  let sortedSeries: Serie[] = series.map((serie: Serie) => ({ symbol: serie.symbol, data: serie.data.reverse() }))
  return sortedSeries
}

export function getSeriesLastPrice(series: Serie[]): LastPrice[] {
  const lastPriceSeries = series.map((serie: Serie) => {
    const length = serie.data.length
    const lastPrice: number = Number(serie.data[length - 1]?.close)
    return { symbol: serie.symbol, lastPrice }
  })

  return lastPriceSeries
}

// Combine the stocks with the last price
export function stocksWithCurrentPrice(lastPriceSeries: LastPrice[], userStocks: SupabaseStock[]): UserStock[] {
  const stocks = userStocks.map((stock) => {
    const lastPrice = lastPriceSeries.find((serie: LastPrice) => serie.symbol === stock.symbol)?.lastPrice || 0
    const userStock: UserStock = {
      current_price: lastPrice,
      id: stock.id,
      user_id: stock.user_id,
      symbol: stock.symbol,
      currency: stock.currency,
      exchange: stock.exchange,
      instrument_name: stock.instrument_name,
      quantity: stock.quantity,
      purchase_price: stock.purchase_price,
      mic_code: stock.mic_code,
    }
    return userStock
  })

  return stocks
}
