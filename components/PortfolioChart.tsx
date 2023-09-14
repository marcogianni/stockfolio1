'use client'

import { useUserStocks } from '@/contexts/UserStocksContext'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip } from 'chart.js'
import { useMemo } from 'react'
import { Line } from 'react-chartjs-2'

type Props = {}

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip)

export const options = {
  responsive: true,
  scales: {
    x: {
      ticks: {
        autoSkipPadding: 30,
      },
    },
  },
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
}

export default function PortfolioChart(props: Props) {
  const { series, stocks, data } = useUserStocks()

  console.debug('Rendering PortfolioChart', { series })

  const getStockQuantity = (symbol: string): number => {
    // given a stock symbol, return the quantity from the stocks array
    if (stocks.length === 0) return 1

    const stock = stocks.find((stock) => stock.symbol === symbol)
    return stock.quantity
  }

  const values = useMemo(() => {
    const seriesLength = series?.[0]?.data.length
    const seriesCount = series?.length
    // aggregate all the values
    const values = []
    for (let i = 0; i < seriesLength; i++) {
      let value = 0
      for (let j = 0; j < seriesCount; j++) {
        value += Number(series?.[j]?.data[i]?.close) * getStockQuantity(series?.[j]?.symbol)
      }
      values.push(value)
    }

    return values
  }, [series])

  const labels = useMemo(() => {
    console.log('calculateLabels', series)
    if (series.length > 0) {
      return series?.[0]?.data.map((serie) => serie.datetime)
    }

    return []
  }, [series])

  const isProfit = useMemo(() => Number(data?.profitLoss) > 0, [data.profitLoss])

  const config = {
    labels,
    datasets: [
      {
        label: 'Portfolio Value',
        data: values,
        fill: true,
        backgroundColor: isProfit ? '#22c55e' : '#e11d48',
        borderColor: isProfit ? '#22c55e' : '#e11d48',
      },
    ],
  }

  return (
    <div className="p-8">
      <Line options={options} data={config} />
    </div>
  )
}
