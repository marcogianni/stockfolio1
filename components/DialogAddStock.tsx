'use client'

import { ColumnDef } from '@tanstack/react-table'
import { useMemo, useReducer } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTable } from '@/components/table-stocks/DataTable'
import { columnsRender } from '@/components/table-stocks/columns'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'

import { searchStock } from '@/api/twelvedata'
import { debounce } from '@/lib/utils'
import { useSupabase } from '@/contexts/SupabaseContext'
import { toast } from '@/components/ui/use-toast'
import { useUserStocks } from '@/contexts/UserStocksContext'
import { UserStock } from '@/lib/types'

type Props = {
  open: boolean
  onClose: () => void
  editingStock: UserStock | null
}

type InitialStateType = {
  query: string
  results: any[]
  loading: boolean
  selected: any
  quantity: number | null
  price: number | null
  currency: string
  error: string | null
}

const initialState: InitialStateType = {
  query: '',
  results: [],
  loading: false,
  selected: null,
  quantity: null,
  price: null,
  currency: 'USD',
  error: null,
}

type State = typeof initialState

type Action = {
  type: 'SET_QUERY' | 'SET_RESULTS' | 'SET_LOADING' | 'SET_SELECTED' | 'SET_CURRENCY' | 'SET_PRICE' | 'SET_QUANTITY' | 'SET_ERROR'
  payload: any
}

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'SET_QUERY':
      return { ...state, query: action.payload }
    case 'SET_RESULTS':
      return { ...state, results: action.payload }
    case 'SET_SELECTED':
      return { ...state, selected: action.payload }
    case 'SET_CURRENCY':
      return { ...state, currency: action.payload }
    case 'SET_PRICE':
      return { ...state, price: Number(action.payload) }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_QUANTITY':
      return { ...state, quantity: Number(action.payload) }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    default:
      return state
  }
}

export default function DialogAddStock(props: Props) {
  const { editingStock } = props
  const { actions } = useUserStocks()
  const { loadStocks } = actions
  const [state, dispatch] = useReducer(reducer, initialState)
  const { supabase, user } = useSupabase()

  console.debug('Rendering DialogAddStock', state)

  const changeQuery = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.length > 0) {
      const data = await searchStock(value) // state.query
      dispatch({ type: 'SET_RESULTS', payload: data.data })
      dispatch({ type: 'SET_QUERY', payload: value })
    }
  }

  const handleChangeQuery = useMemo(() => debounce(changeQuery, 500), [])
  const handleChangeQuantity = useMemo(() => debounce((e) => dispatch({ type: 'SET_QUANTITY', payload: Number(e.target.value) }), 500), [])
  const handleChangePrice = useMemo(() => debounce((e) => dispatch({ type: 'SET_PRICE', payload: Number(e.target.value) }), 500), [])
  const dataTableRows = useMemo(() => {
    if (editingStock !== null) {
      return [editingStock]
    } else {
      return state.results
    }
  }, [state.results, editingStock])

  const handleSubmit = async () => {
    dispatch({ type: 'SET_LOADING', payload: true })

    if (editingStock) {
      const { data, error } = await supabase
        .from('user_stocks')
        .update({ quantity: state.quantity, purchase_price: state.price, currency: state.currency })
        .eq('id', editingStock.id)
        .select()
      if (error) {
        toast({ title: 'Error', description: error.message })
      } else {
        toast({ title: 'Success', description: 'Stock successfully updated' })
      }
    } else {
      const { data, error } = await supabase
        .from('user_stocks')
        .insert({
          user_id: user?.id,
          symbol: state.selected?.symbol,
          instrument_name: state.selected?.instrument_name,
          mic_code: state.selected?.mic_code,
          exchange: state.selected?.exchange,
          quantity: state.quantity,
          purchase_price: state.price,
          currency: state.currency,
        })
        .select()

      if (error) {
        toast({ title: 'Error', description: error.message })
      } else {
        toast({ title: 'Success', description: 'Stock added successfully' })
      }
    }

    await loadStocks()

    dispatch({ type: 'SET_LOADING', payload: false })

    props.onClose()
  }

  const columns: ColumnDef<UserStock>[] = columnsRender(editingStock)

  return (
    <Dialog open={props.open}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>{editingStock ? 'Edit Stock' : 'Add Stock'}</DialogHeader>
        <div>
          {!editingStock && (
            <Input required onChange={handleChangeQuery} placeholder="Search by symbol and toggle it" id="query" className="col-span-3" />
          )}

          <DataTable columns={columns} data={dataTableRows} dispatch={dispatch} />
          <Separator />
          <Input
            onChange={handleChangeQuantity}
            defaultValue={editingStock?.quantity.toString() ?? state?.quantity?.toString()}
            type="number"
            placeholder="Insert quantity"
            id="quantity"
            className="col-span-3 mt-3"
          />
          <div className="flex items-center space-x-2 mt-3">
            <Input
              onChange={handleChangePrice}
              defaultValue={editingStock?.purchase_price.toString() ?? state.price?.toString()}
              type="number"
              placeholder="Insert purchase price"
              id="price"
              className="col-span-3 flex-1"
            />
            <Select value={state.currency} onValueChange={(value) => dispatch({ type: 'SET_CURRENCY', payload: value })}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Currency</SelectLabel>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="CAD">CAD</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={props.onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={state.loading}>
            {editingStock ? 'Edit Stock' : 'Add Stock'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
