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
  const { series } = useUserStocks()

  console.debug('Rendering PortfolioChart', { series })

  //   const labels = useMemo(() => series?.[0]?.map((serie) => serie.data.datetime), [series])
  //   const values = useMemo(() => series?.[0]?.map((serie) => serie.close), [series])

  //   const final = series?.reduce((acc, serie) => {
  //     return serie.map((s) => s.close)
  //   }, [])

  //   const data = {
  //     labels,
  //     datasets: [
  //       {
  //         label: 'Portfolio Value',
  //         data: values,
  //         fill: true,
  //         backgroundColor: '#22c55e',
  //         borderColor: '#22c55e',
  //       },
  //     ],
  //   }

  return <div className="p-8">{/* <Line options={options} data={data} /> */}</div>
}
