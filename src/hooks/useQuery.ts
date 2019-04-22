import { useState, useEffect, useRef, useMemo } from 'react'
import { isEqual, merge } from 'lodash'

import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios'

import { usePrevious } from './usePrevious'

export interface IQueryProps<P, T = object> {
  initialData?: P
  variable?: T
  pollInterval?: number
  skip?: boolean
  autoQuery?: boolean
  query(config: AxiosRequestConfig, variable?: T): Promise<void | P>
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
    props.initialData
  )
  const [error, setError] = useState<Error>()
  const [loading, setLoading] = useState(false)
  const [intervalIndex, setIntervalIndex] = useState<number>()
  const [isCalled, setIsCalled] = useState(false)
  const prevVariable = usePrevious(mergedProps.variable)
  const intervalIndexRef = useRef(intervalIndex)
  const cancelTokenSourceRef = useRef<CancelTokenSource>()

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
    setLoading(true)

    cancelTokenSourceRef.current = axios.CancelToken.source()

    const query = mergedProps.query(
      {
        cancelToken: cancelTokenSourceRef.current.token,
      },
      variable
    )

    try {
      const queryResult = await query

      if (queryResult) {
        setData(queryResult)

        typeof props.onSuccess === 'function' && props.onSuccess(queryResult)
      } else {
        _reset()
      }
    } catch (error) {
      _reset()

      setError(error)
      typeof props.onFailure === 'function' && props.onFailure(error)
    } finally {
      setLoading(false)
      cancelTokenSourceRef.current = undefined
    }

    return query
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
  const cancel = () => {
    if (cancelTokenSourceRef.current) {
      cancelTokenSourceRef.current.cancel()
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
    cancel,
    refetch,
    startPolling,
    stopPolling,
  }
}
