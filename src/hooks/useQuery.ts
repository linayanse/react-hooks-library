import { useState, useEffect } from 'react'
import { isEqual, merge } from 'lodash'

import { usePrevious } from './usePrevious'

export interface IQueryProps<P> {
  initialData?: P
  variable?: object
  pollInterval?: number
  skip?: boolean
  autoQuery?: boolean
  query?(params?: IQueryProps<P>['variable']): Promise<P>
  onSuccess?(result: P): void
  onFailure?(error: Error): void
}

export function useQuery<P>(props: IQueryProps<P>) {
  const defaultProps = {
    skip: false,
    autoQuery: true,
  }
  const mergedProps = merge(defaultProps, props)

  const [data, setData] = useState<IQueryProps<P>['initialData']>(
    mergedProps.initialData
  )
  const [error, setError] = useState<any>(undefined)
  const [loading, setLoading] = useState(false)
  const [intervalIndex, setIntervalIndex] = useState<number | undefined>(
    undefined
  )
  const [isCalled, setIsCalled] = useState(false)
  const prevVariable = usePrevious(mergedProps.variable)

  const isShouldQuery = () => {
    // the first time
    if (!isCalled) {
      if (!mergedProps.skip) {
        return true
      }
    } else if (mergedProps.autoQuery) {
      if (!isEqual(prevVariable, mergedProps.variable)) {
        return true
      }
    }

    return false
  }
  const reset = () => {
    setData(mergedProps.initialData)
  }

  const queryTransaction = async (variable = mergedProps.variable) => {
    if (mergedProps.query) {
      setLoading(true)

      try {
        const response = await mergedProps.query(variable)

        if (response) {
          setData(response)
        } else {
          reset()
        }

        setLoading(false)
        typeof props.onSuccess === 'function' && props.onSuccess(response)

        return response
      } catch (error) {
        setError(error)

        typeof props.onFailure === 'function' && props.onFailure(error)

        throw error
      }
    }

    return undefined
  }
  const refetch = queryTransaction
  const startPolling = (
    interval: number,
    variable?: IQueryProps<P>['variable']
  ) => {
    setIntervalIndex(
      window.setInterval(() => {
        queryTransaction(variable)
      }, interval)
    )
  }
  const stopPolling = () => {
    if (intervalIndex !== undefined) {
      window.clearInterval(intervalIndex)
      setIntervalIndex(undefined)
    }
  }

  // fetch data
  useEffect(() => {
    if (isShouldQuery()) {
      queryTransaction()
    }

    setIsCalled(true)
  }, [props.variable])

  return {
    data,
    reset,
    loading,
    error,
    refetch,
    startPolling,
    stopPolling,
  }
}
