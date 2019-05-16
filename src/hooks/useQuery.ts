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
    mergedConfig.initialData
  )
  const { cancellablePromise } = useCancellablePromise()
  const [error, setError] = useState<Error | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const intervalIndexRef = useRef<number | undefined>(undefined)
  const variableRef = useRef(variable)
  const [isCalled, setIsCalled] = useState(false)
  const prevVariable = usePrevious(variable)

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
    if (mergedConfig.query) {
      setLoading(true)

      try {
        const response = await cancellablePromise(mergedConfig.query(v))

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

  useEffect(() => {
    // update variable
    variableRef.current = variable

    if (_isShouldQuery()) {
      _queryTransaction()
    }

    setIsCalled(true)
  }, [variable])

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
