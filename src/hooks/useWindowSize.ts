'use client'
import { useState, useEffect } from 'react'

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  })

  const handleResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    })
  }

  useEffect(() => {
    handleResize()
    // Add event listener to the window resize event
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize)
    }
    // Clean up the event listener when the hook unmounts
    return () => {
      if (window && typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [])

  return windowSize
}

export default useWindowSize
