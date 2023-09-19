'use client'

import { stockOverview } from '@/api/alphavantage'
import { companyInfo } from '@/api/finnhub'
import Diversification from '@/components/Diversification'
import { useEffect } from 'react'

export default function DiversificationPage() {
  // useEffect(() => {
  //   const getInfo = async () => {
  //     const res = await stockOverview('AAPL')
  //     console.debug(res)
  //   }

  //   getInfo()
  // }, [])

  return (
    <div className="flex-1">
      <div className="container relative">
        <Diversification />
      </div>
    </div>
  )
}
