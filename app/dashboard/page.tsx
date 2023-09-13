'use client'

import DialogAddStock from '@/components/DialogAddStock'
import Empty from '@/components/Empty'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [dialogOpen, setDialogOpen] = useState(false)
  // useEffect(() => {
  //   const loadData = async () => {
  //     const data = await searchStock('AA')
  //     console.log('Dashboard', data)
  //   }
  //   loadData()
  // }, [])

  const handleOpenDialog = () => {
    setDialogOpen(true)
  }

  return (
    <div className="flex-1">
      <div className="container relative">
        <Empty handleOpenDialog={handleOpenDialog} />
        <DialogAddStock open={dialogOpen} onClose={() => setDialogOpen(false)} />
      </div>
    </div>
  )
}
