export interface Serie {
  symbol: string
  open: number
  close: number
  high: number
  low: number
  datetime: string
  volume: number
}

export interface UserStock {
  id: number
  symbol: string
  currency: string
  exchange: string
  instrument_name: string
  quantity: number
  purchase_price: number
  current_price: number
}
