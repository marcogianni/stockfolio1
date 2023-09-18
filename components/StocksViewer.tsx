import { UserStock } from '@/lib/types'

import { useSupabase } from '@/contexts/SupabaseContext'
import { useUserStocks } from '@/contexts/UserStocksContext'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import { toast } from '@/components/ui/use-toast'

type Props = {
  handleEditStock: (stock: UserStock) => void
}

export default function StockViewer(props: Props) {
  const { stocks, actions } = useUserStocks()
  const { supabase } = useSupabase()
  const { deleteStock } = actions

  if (stocks.length === 0) {
    return null
  }

  const handleDelete = async (stock: UserStock) => {
    const { error } = await supabase.from('user_stocks').delete().eq('id', stock.id)
    console.debug('handleDelete', error)

    if (error) {
      return toast({ title: 'Error', description: error.message })
    } else {
      deleteStock(stock)
      return toast({ title: 'Success', description: 'Stock deleted successfully' })
    }
  }

  return stocks.map(
    (stock: UserStock): React.ReactNode => (
      <Card className="mt-4" key={stock.id}>
        <CardContent className="p-3">
          <div className="flex grid-cols-6 gap-6 items-center flex-wrap md:flex-nowrap">
            <div className="md:flex-1">
              <div className="text-sm">Stock</div>
              <div className="text-lg font-bold">{stock.symbol}</div>
            </div>
            <div className="md:flex-1">
              <div className="text-sm">Quantity</div>
              <div className="text-lg font-bold">{stock.quantity}</div>
            </div>
            <div className="md:flex-1">
              <div className="text-sm">Exchange</div>
              <div className="text-lg font-bold">{stock.exchange}</div>
            </div>

            <div className="md:flex-1">
              <div className="text-sm">Purchase Price</div>
              <div className="text-lg font-bold">$ {stock.purchase_price}</div>
            </div>
            <div className="md:flex-1">
              <div className="text-sm">Current Price</div>
              <div className="text-lg font-bold">$ {stock.current_price}</div>
            </div>
            <div className="flex justify-end flex-1">
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => props.handleEditStock(stock)}>
                      <Pencil1Icon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete Stock</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="ml-2" onClick={() => handleDelete(stock)}>
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete Stock</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  )
}
