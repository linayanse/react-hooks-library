import { useState, useEffect, useRef, useMemo } from 'react'
import { isEqual, merge } from 'lodash'

import { usePrevious } from './usePrevious'
import { useCancellablePromise } from './useCancellablePromise'

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
  const mergedProps = useMemo(
    () =>
      merge(
        {
          skip: false,
          autoQuery: true,
        },
        props
      ),
    [props]
  )
  const [data, setData] = useState<IQueryProps<P>['initialData']>(
    mergedProps.initialData
  )
  const { cancellablePromise } = useCancellablePromise()
  const [error, setError] = useState<Error | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [intervalIndex, setIntervalIndex] = useState<number | undefined>(
    undefined
  )
  const intervalIndexRef = useRef(intervalIndex)
  const [isCalled, setIsCalled] = useState(false)
  const prevVariable = usePrevious(mergedProps.variable)

  const _reset = () => {
    setData(mergedProps.initialData)
  }
  const _isShouldQuery = () => {
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
  const _queryTransaction = async (variable = mergedProps.variable) => {
    if (mergedProps.query) {
      setLoading(true)

      try {
        const response = await cancellablePromise(mergedProps.query(variable))

        if (response) {
          setData(response)
        } else {
          _reset()
        }

        setLoading(false)
        typeof props.onSuccess === 'function' && props.onSuccess(response)

        return response
      } catch (error) {
        setError(error)

        typeof props.onFailure === 'function' && props.onFailure(error)
      }
    }

    return undefined
  }

  const refetch = _queryTransaction
  const startPolling = (
    interval: number,
    variable?: IQueryProps<P>['variable']
  ) => {
    setIntervalIndex(
      window.setInterval(() => {
        _queryTransaction(variable)
      }, interval)
    )
  }
  const stopPolling = () => {
    if (intervalIndexRef.current !== undefined) {
      window.clearInterval(intervalIndexRef.current)
      setIntervalIndex(undefined)
    }
  }

  useEffect(() => {
    if (_isShouldQuery()) {
      _queryTransaction()
    }

    setIsCalled(true)
  }, [mergedProps.variable])

  useEffect(() => {
    intervalIndexRef.current = intervalIndex
  }, [intervalIndex])

  return {
    data,
    reset: _reset,
    loading,
    error,
    refetch,
    startPolling,
    stopPolling,
  }
}
