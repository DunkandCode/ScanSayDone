'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const PanelDemoContext = createContext(null)

export function PanelDemoProvider({ children }) {
  const [isDemo, setIsDemo] = useState(false)
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    const on = () => setIsOffline(false)
    const off = () => setIsOffline(true)
    setIsOffline(!navigator.onLine)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])

  return (
    <PanelDemoContext.Provider value={{ isDemo, setIsDemo, isOffline }}>
      {children}
    </PanelDemoContext.Provider>
  )
}

export function usePanelDemo() {
  const ctx = useContext(PanelDemoContext)
  if (!ctx) throw new Error('usePanelDemo fuera de PanelDemoProvider')
  return ctx
}
