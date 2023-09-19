import { Colors, Chart as ChartJS, ArcElement, Tooltip } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

import { useUserStocks } from '@/contexts/UserStocksContext'
import { useMemo } from 'react'
import { UserStock } from '@/lib/types'

ChartJS.register(ArcElement, Tooltip, Colors)

const options = {
  responsive: true,
  maintainAspectRatio: false,
  colors: {
    enabled: true,
  },
  plugins: {
    colors: {
      forceOverride: true,
    },
    tooltip: {
      intersect: false,
    },
  },
}

export default function PortfolioDoughnutChart() {
  const { stocks } = useUserStocks()

  const labels = useMemo(() => stocks.map((stock: UserStock) => stock.symbol), [stocks])
  const data = useMemo(() => stocks.map((stock: UserStock) => stock.quantity * stock?.current_price), [stocks])

  const config = {
    labels: labels,
    datasets: [
      {
        label: 'Portfolio',
        data: data,
      },
    ],
  }

  return (
    <div className="p-10 h-[200px] md:h-[400px]">
      <Doughnut data={config} options={options} />
    </div>
  )
}
