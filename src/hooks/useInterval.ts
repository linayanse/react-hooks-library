import { useEffect, useRef } from 'react'

export function useInterval(callback: () => void, delay: number) {
  const savedCallback = useRef<typeof callback>()

  // 保存新回调
  useEffect(() => {
    savedCallback.current = callback
  })

  // 建立 interval
  useEffect(() => {
    const index = setInterval(() => {
      savedCallback.current && savedCallback.current()
    }, delay)

    return () => {
      clearInterval(index)
    }
  }, [delay])
}
