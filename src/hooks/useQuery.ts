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
  const { variable, ...rest } = props
  const mergedConfig = useMemo(
    () =>
      merge(
        {
          skip: false,
          autoQuery: true,
        },
        rest
      ),
    [rest]
  )
  const [data, setData] = useState<IQueryProps<P>['initialData']>(
    props.initialData
  )
  const [error, setError] = useState<Error>()
  const [loading, setLoading] = useState(false)
  const [isCalled, setIsCalled] = useState(false)
  const prevVariable = usePrevious(variable)
  const variableRef = useRef(variable)
  const intervalIndexRef = useRef<number | undefined>(undefined)
  const cancelTokenSourceRef = useRef<CancelTokenSource>()

  const _reset = () => {
    setData(mergedConfig.initialData)
  }
  const _isShouldQuery = () => {
    // the first time
    if (!isCalled) {
      if (!mergedConfig.skip) {
        return true
      }
    } else if (mergedConfig.autoQuery) {
      if (!isEqual(prevVariable, variableRef.current)) {
        return true
      }
    }

    return false
  }
  const _queryTransaction = async (v = variableRef.current) => {
    setLoading(true)

    cancelTokenSourceRef.current = axios.CancelToken.source()

    const query = mergedConfig.query(
      {
        cancelToken: cancelTokenSourceRef.current.token,
      },
      v
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
  const startPolling = (timeout: number, v?: IQueryProps<P>['variable']) => {
    intervalIndexRef.current = window.setInterval(() => {
      _queryTransaction(v)
    }, timeout)
  }
  const stopPolling = () => {
    if (intervalIndexRef.current !== undefined) {
      window.clearInterval(intervalIndexRef.current)
      intervalIndexRef.current = undefined
    }
  }
  const cancel = () => {
    if (cancelTokenSourceRef.current) {
      cancelTokenSourceRef.current.cancel()
    }
  }

  useEffect(() => {
    // update variable
    variableRef.current = variable

    if (_isShouldQuery()) {
      _queryTransaction()
    }

    setIsCalled(true)

    return cancel
  }, [variable])

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
