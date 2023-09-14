'use client'

import { timeSeries } from '@/api/twelvedata'
import DialogAddStock from '@/components/DialogAddStock'
import Empty from '@/components/Empty'
import Overview from '@/components/Overview'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useUserStocks } from '@/contexts/UserStocksContext'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { stocks, actions } = useUserStocks()

  const handleOpenDialog = () => {
    setDialogOpen(true)
  }

  // useEffect(() => {
  //   const series = async () => {
  //     const data = await timeSeries('AAPL', '1month')
  //     console.log('Series', data)
  //   }
  //   series()
  // })

  // MOVE STATE TO THE CHILDREN

  return (
    <div className="flex-1">
      <div className="container relative">
        {stocks.length === 0 ? <Empty handleOpenDialog={handleOpenDialog} /> : <Overview handleOpenDialog={handleOpenDialog} />}
        <DialogAddStock open={dialogOpen} onClose={() => setDialogOpen(false)} />
      </div>
    </div>
  )
}
