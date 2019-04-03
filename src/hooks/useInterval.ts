import { useEffect, useRef } from 'react'

export function useInterval(callback: () => void, delay: number) {
  const savedCallback = useRef<typeof callback>()

  // 保存新回调
  useEffect(() => {
    savedCallback.current = callback
  })

  // 建立 interval
  useEffect(() => {
    function tick() {
      savedCallback.current && savedCallback.current()
    }

    if (delay !== null) {
      const index = setInterval(tick, delay)

      return () => {
        clearInterval(index)
      }
    }

    return () => {}
  }, [delay])
}
