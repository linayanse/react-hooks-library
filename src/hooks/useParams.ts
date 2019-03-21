import { useState, useEffect } from 'react'
import { isEqual } from 'lodash'

import { usePrevious } from './usePrevious'

export interface IStateKey {
  [key: string]: {
    value?: any
    defaultValue?: any
    onChange?(newValue: any): void
  }
}

export interface IStateStore {
  [key: string]: any
}

export type IStateSetter = (key: string | number) => (newValue: any) => void

function isControlled(value: any): boolean {
  return value !== undefined
}

// 创建Store
const createStore = (keys: IStateKey) =>
  Object.keys(keys).reduce(
    (total, key) => {
      const { value, defaultValue } = keys[key]

      if (defaultValue) {
        total[key] = defaultValue
      } else {
        total[key] = value
      }

      return total
    },
    {} as IStateStore
  )

export function useParams(stateKeys: IStateKey): [IStateStore, IStateSetter] {
  const [stateStore, setStateStore] = useState(createStore(stateKeys))
  const prevStateKeys = usePrevious(stateKeys)

  const setStateByKey = (key: keyof typeof stateStore) => (newValue: any) => {
    const sourceState = stateKeys[key]

    if (!isControlled(sourceState[key])) {
      setStateStore({
        ...stateStore,
        ...{
          [key]: newValue,
        },
      })
    }

    if (typeof sourceState.onChange === 'function') {
      sourceState.onChange(newValue)
    }
  }

  useEffect(() => {
    if (!isEqual(prevStateKeys, stateKeys)) {
      setStateStore(createStore(stateKeys))
    }
  }, [stateKeys])

  return [stateStore, setStateByKey]
}
