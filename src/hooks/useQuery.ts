import { useState, useEffect } from 'react'
import { isEqual } from 'lodash'

import { usePrevious } from './usePrevious'
import { decorateModel } from '../fields'

export interface IQueryProps<P> {
  initialData?: P
  variable?: object
  pollInterval?: number
  skip?: boolean
  query?(params?: IQueryProps<P>['variable']): Promise<P>
}

export function useQuery<P>(props: IQueryProps<P>) {
  const [data, setData] = useState<IQueryProps<P>['initialData']>(
    props.initialData
  )
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
  const reset = () => {
    setData(props.initialData)
  }

  const queryTransaction = async (skip: boolean, variable = props.variable) => {
    if (!skip && props.query) {
      setLoading(true)
      setIsCalled(true)

      const response = await props.query(variable)

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
          reset()

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
    reset,
    loading,
    error,
    refetch,
    startPolling,
    stopPolling,
  }
}
