import { useState, useEffect } from 'react'
import { isEqual } from 'lodash'

import { usePrevious } from './usePrevious'
import { decorateModel } from '../fields'

export interface IQueryProps {
  variable?: object
  pollInterval?: number
  skip?: boolean
  query?(params?: object): Promise<any>
}

export function useQuery(props: IQueryProps) {
  const [data, setData] = useState(undefined)
  const [error, setError] = useState(undefined)
  const [loading, setLoading] = useState(false)
  const [intervalIndex, setIntervalIndex] = useState<number | undefined>(
    undefined
  )
  const prevVariable = usePrevious(props.variable)

  const isVariableChange = () => {
    if (
      props.variable === undefined ||
      !isEqual(prevVariable, props.variable)
    ) {
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

      const query = props.query(props.variable)

      try {
        const response = await query

        if (response) {
          if (response.defintions) {
            setData({
              ...response,
              data: decorateModel(response.data, response.defintions),
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
      }
    }
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
