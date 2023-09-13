'use client'

import DialogAddStock from '@/components/DialogAddStock'
import Empty from '@/components/Empty'
import { useState } from 'react'

export default function Dashboard() {
  const [dialogOpen, setDialogOpen] = useState(false)

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
