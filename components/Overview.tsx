import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useUserStocks } from '@/contexts/UserStocksContext'

export default function Overview() {
  const { data } = useUserStocks()
  return (
    <div className="mt-6">
      <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
      <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Stockfolio Value</CardTitle>
            <CardDescription>The current value of your stockfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$ {data.portfolioValue}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Invested</CardTitle>
            <CardDescription>The amount invested for these stocks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$ {data.totalInvested}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Profit/Loss</CardTitle>
            <CardDescription>How is going your investment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+ {data.profitLoss}%</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Chart</CardTitle>
          </CardHeader>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Stocks</CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
