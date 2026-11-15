import { useState, useEffect } from 'react'

export function useStored(key, initial) {
  const [v, setV] = useState(() => {
    try { return { ...initial, ...JSON.parse(localStorage.getItem(key) || '{}') } } catch { return initial }
  })
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)) } catch {} }, [key, v])
  return [v, setV]
}
