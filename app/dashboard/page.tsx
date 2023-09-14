'use client'

import { useState } from 'react'

import DialogAddStock from '@/components/DialogAddStock'
import Overview from '@/components/Overview'

export default function Dashboard() {
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleOpenDialog = () => {
    setDialogOpen(true)
  }

  return (
    <div className="flex-1">
      <div className="container relative">
        <Overview handleOpenDialog={handleOpenDialog} />
        <DialogAddStock open={dialogOpen} onClose={() => setDialogOpen(false)} />
      </div>
    </div>
  )
}
