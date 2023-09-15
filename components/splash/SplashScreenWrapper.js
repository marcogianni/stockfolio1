'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

import SplashScreen from '@/components/splash/SplashScreen'

export default function SplashScreenWrapper({ children }) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  return (
    <>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: loading ? 1 : 0, pointerEvents: 'none' }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <SplashScreen />
      </motion.div>
      {children}
    </>
  )
}
