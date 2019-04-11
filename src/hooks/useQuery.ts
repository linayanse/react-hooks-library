import { useState, useEffect, useRef, useMemo } from 'react'
import { isEqual, merge } from 'lodash'

import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  CancelTokenSource,
} from 'axios'
import { request } from '../request/axios'

import { usePrevious } from './usePrevious'

export type IQuery = Pick<
  AxiosRequestConfig,
  Exclude<keyof AxiosRequestConfig, 'params' | 'data' | 'cancelToken'>
>

export interface IQueryProps<P> {
  query: IQuery
  initialData?: P
  variable?: object
  pollInterval?: number
  skip?: boolean
  autoQuery?: boolean
  onSuccess?(result: P): void
  onFailure?(error: Error): void
}

async function createRequest<P>(
  query: IQuery,
  variable: IQueryProps<P>['variable'],
  cancelTokenSource: CancelTokenSource
) {
  if (
    query.method === 'PUT' ||
    query.method === 'POST' ||
    query.method === 'PATCH'
  ) {
    return request<P>({
      ...query,
      data: variable,
      cancelToken: cancelTokenSource.token,
    })
  } else {
    return request<P>({
      ...query,
      params: variable,
      cancelToken: cancelTokenSource.token,
    })
  }
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
  const [response, setResponse] = useState<AxiosResponse<P>>()
  const [error, setError] = useState<Error>()
  const [loading, setLoading] = useState(false)
  const [intervalIndex, setIntervalIndex] = useState<number>()
  const [isCalled, setIsCalled] = useState(false)
  const prevVariable = usePrevious(mergedProps.variable)
  const intervalIndexRef = useRef(intervalIndex)
  const cancelTokenSourceRef = useRef<CancelTokenSource>()

  const _reset = () => {
    setData(mergedProps.initialData)
    setResponse(undefined)
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

    const query = createRequest<P>(
      mergedProps.query,
      variable,
      cancelTokenSourceRef.current
    )

    try {
      const queryResult = await query

      if (queryResult) {
        const [isSuccess, queryResponse] = queryResult

        if (isSuccess) {
          setData(queryResponse.data)

          typeof props.onSuccess === 'function' &&
            props.onSuccess(queryResponse.data)
        } else {
          _reset()
        }

        setResponse(queryResponse)
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
    response,
    reset: _reset,
    loading,
    error,
    cancel,
    refetch,
    startPolling,
    stopPolling,
  }
}
