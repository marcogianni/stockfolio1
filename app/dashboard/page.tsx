'use client'

import { timeSeries } from '@/api/twelvedata'
import DialogAddStock from '@/components/DialogAddStock'
import Empty from '@/components/Empty'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [dialogOpen, setDialogOpen] = useState(false)

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
        <Empty handleOpenDialog={handleOpenDialog} />
        <DialogAddStock open={dialogOpen} onClose={() => setDialogOpen(false)} />
      </div>
    </div>
  )
}
