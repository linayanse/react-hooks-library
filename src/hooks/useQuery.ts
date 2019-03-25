import { useState, useEffect } from 'react'
import { isEqual } from 'lodash'

import { usePrevious } from './usePrevious'
import { decorateModel } from '../fields'

export interface IQueryProps<P> {
  initialData?: P
  variable?: object
  pollInterval?: number
  skip?: boolean
  query?(params?: object): Promise<P>
}

export function useQuery<P>(props: IQueryProps<P>) {
  const [data, setData] = useState<P | undefined>(props.initialData)
  const [error, setError] = useState<any>(undefined)
  const [loading, setLoading] = useState(false)
  const [intervalIndex, setIntervalIndex] = useState<number | undefined>(
    undefined
  )
  const [isCalled, setIsCalled] = useState(false)
  const prevVariable = usePrevious(props.variable)

  const isVariableChange = () => {
    if (!isCalled || !isEqual(prevVariable, props.variable)) {
      return true
    }

    return false
  }
  const clear = () => {
    setData(undefined)
  }

  const queryTransaction = async (skip: boolean) => {
    if (!skip && props.query) {
      setLoading(true)
      setIsCalled(true)

      const response = await props.query(props.variable)

      try {
        if (response) {
          if (response['defintions']) {
            setData({
              ...response,
              data: decorateModel(response['data'], response['defintions']),
            })
          } else {
            setData(response)
          }

          setLoading(false)
        } else {
          clear()

          setLoading(false)
        }

        return response
      } catch (error) {
        setError(error)

        return response
      }
    }

    return undefined
  }
  const refetch = () => queryTransaction(false)
  const startPolling = (interval: number) => {
    setIntervalIndex(window.setInterval(queryTransaction, interval))
  }
  const stopPolling = () => {
    if (intervalIndex !== undefined) {
      window.clearInterval(intervalIndex)
      setIntervalIndex(undefined)
    }
  }

  // fetch data
  useEffect(() => {
    if (isVariableChange()) {
      queryTransaction(props.skip || false)
    }
  }, [props.skip, props.variable])

  return {
    data,
    clear,
    loading,
    error,
    refetch,
    startPolling,
    stopPolling,
  }
}
