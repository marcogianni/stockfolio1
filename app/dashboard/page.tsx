'use client'

import { searchStock } from '@/api/twelvedata'
import Empty from '@/components/Empty'
import { useEffect } from 'react'

export default function Dashboard() {
  useEffect(() => {
    const loadData = async () => {
      const data = await searchStock('AA')
      console.log('Dashboard', data)
    }
    loadData()
  }, [])

  return (
    <div className="flex-1">
      <div className="container relative">
        <Empty />
      </div>
    </div>
  )
}
