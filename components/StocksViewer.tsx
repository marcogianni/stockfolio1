import { Card, CardContent } from '@/components/ui/card'
import { useUserStocks } from '@/contexts/UserStocksContext'
import { UserStock } from '@/lib/types'

import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'

export default function StockViewer() {
  const { stocks } = useUserStocks()

  if (stocks.length === 0) {
    return null
  }

  return stocks.map(
    (stock: UserStock): React.ReactNode => (
      <Card className="mt-4" key={stock.id}>
        <CardContent>
          <div className="flex grid-cols-6 gap-6 mt-4 items-center">
            <div className="flex-1">
              <div className="text-sm">Stock</div>
              <div className="text-lg font-bold">{stock.symbol}</div>
            </div>
            <div className="flex-1">
              <div className="text-sm">Quantity</div>
              <div className="text-lg font-bold">{stock.quantity}</div>
            </div>
            <div className="flex-1">
              <div className="text-sm">Exchange</div>
              <div className="text-lg font-bold">{stock.exchange}</div>
            </div>

            <div className="flex-1">
              <div className="text-sm">Purchase Price</div>
              <div className="text-lg font-bold">$ {stock.purchase_price}</div>
            </div>
            <div className="flex-1">
              <div className="text-sm">Current Price</div>
              <div className="text-lg font-bold">$ {stock.current_price}</div>
            </div>
            <div className="flex justify-end flex-1">
              <Button variant="outline" size="icon">
                <Pencil1Icon className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="ml-2">
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  )
}
