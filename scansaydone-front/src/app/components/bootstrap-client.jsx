'use client'

import { useEffect } from 'react'

export default function BootstrapClient() {
  useEffect(() => {
    // Dynamic import — solo corre en cliente (useEffect no corre en prerender)
    // Bootstrap JS necesita document/window para inicializarse
    import('bootstrap/dist/js/bootstrap.bundle.min.js')
  }, [])

  return null
}
