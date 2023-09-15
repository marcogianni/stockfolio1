import { useMemo } from 'react'

import { TriangleUpIcon } from '@radix-ui/react-icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Empty from '@/components/Empty'
import OverviewCard from '@/components/OverviewCard'
import PortfolioLineChart from '@/components/PortfolioLineChart'
import PortfolioDoughnutChart from '@/components/PortfolioDoughnutChart'
import StockViewer from '@/components/StocksViewer'

import { useUserStocks } from '@/contexts/UserStocksContext'
import { useSupabase } from '@/contexts/SupabaseContext'

type Props = {
  handleOpenDialog: () => void
}

export default function Overview(props: Props) {
  const { data, stocks } = useUserStocks()
  const { user } = useSupabase()

  console.debug('Overview', { data })

  const isInProfit = useMemo(() => Number(data?.profitLoss) > 0, [data.profitLoss])

  const isLoggedIn = useMemo(() => {
    if (!user) return false
    return true
  }, [user])

  if (stocks.length === 0 || !isLoggedIn) {
    return <Empty handleOpenDialog={props.handleOpenDialog} isLoggedIn={isLoggedIn} />
  }

  return (
    <div className="mt-6">
      <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
      <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-3">
        <OverviewCard title="Stockfolio Value" description="The current value of your stockfolio">
          <div className="text-2xl font-bold">$ {data?.portfolioValue}</div>
        </OverviewCard>
        <OverviewCard title="Total Invested" description="The amount invested for these stocks">
          <div className="text-2xl font-bold">$ {data?.totalInvested}</div>
        </OverviewCard>
        <OverviewCard title="Total Profit/Loss" description="The total profit/loss for these stocks">
          <div className="text-2xl font-bold flex items-center" style={{ color: isInProfit ? '#22c55e' : '#e11d48' }}>
            <TriangleUpIcon
              className="h-6 w-6"
              style={{
                color: isInProfit ? '#22c55e' : '#e11d48',
                transform: isInProfit ? 'rotate(0deg)' : 'rotate(180deg)',
              }}
            />
            <span>{data?.profitLoss.replace('-', '')}%</span>
          </div>
        </OverviewCard>
      </div>
      <div className="grid grid-cols-12 gap-6 mt-6">
        <Card className="col-span-9 inline-block relative">
          <PortfolioLineChart />
        </Card>
        <Card className="col-span-3">
          <PortfolioDoughnutChart />
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-6 mt-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="mb-0">
              <div className="flex justify-between items-center">
                <span>Stocks</span>
                <Button onClick={props.handleOpenDialog}>Add Stocks</Button>
              </div>
            </CardTitle>
            <CardContent>
              <StockViewer />
            </CardContent>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
