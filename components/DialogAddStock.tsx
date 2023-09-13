'use client'

import { useMemo, useReducer } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTable } from '@/components/table-stocks/DataTable'
import { columns } from '@/components/table-stocks/columns'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'

import { searchStock } from '@/api/twelvedata'
import { debounce } from '@/lib/utils'
type Props = {
  open: boolean
  onClose: () => void
}

const initialState = {
  query: '',
  results: [],
  loading: false,
  selected: null,
  currency: 'USD',
  error: null,
}

type State = typeof initialState

type Action = {
  type: 'SET_QUERY' | 'SET_RESULTS' | 'SET_LOADING' | 'SET_SELECTED' | 'SET_CURRENCY' | 'SET_ERROR'
  payload: any
}

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'SET_QUERY':
      return { ...state, query: action.payload }
    case 'SET_RESULTS':
      return { ...state, results: action.payload }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_SELECTED':
      return { ...state, selected: action.payload }
    case 'SET_CURRENCY':
      return { ...state, currency: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    default:
      return state
  }
}

export default function DialogAddStock(props: Props) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const changeQuery = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.length > 0) {
      const data = await searchStock(value) // state.query
      console.log('searchStock', data.data)
      dispatch({ type: 'SET_RESULTS', payload: data.data })
    }

    dispatch({ type: 'SET_QUERY', payload: value })
  }

  const handleChangeQuery = useMemo(() => debounce(changeQuery, 500), [])

  console.debug('DialogAddStock rendering!')

  return (
    <Dialog open={props.open}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>Add Stock</DialogHeader>
        <div>
          <Input onChange={handleChangeQuery} placeholder="Search by symbol and toggle it" id="query" className="col-span-3" />
          <DataTable columns={columns} data={state.results} />
          <Separator />
          <Input type="number" placeholder="Insert quantity" id="quantity" className="col-span-3 mt-3" />
          <div className="flex items-center space-x-2 mt-3">
            <Input type="number" placeholder="Insert purchase price" id="price" className="col-span-3 flex-1" />
            <Select value={state.currency}>
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
          <Button>Add Stock</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
