import { useRef, useEffect } from 'react'

export function usePrevious<P>(value: P): P | undefined {
  const ref = useRef<P | undefined>(undefined)

  useEffect(() => {
    ref.current = value
  })

  return ref.current
}
