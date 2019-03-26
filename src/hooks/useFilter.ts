import { IStateKey, IStateStore, IStateSetter, useParams } from './useParams'

type IEqual = ((filterState: any, dataValue: any) => boolean) | undefined

interface IFilters {
  [key: string]: {
    equals: IEqual
  }
}

type Itreater<P> = (data: P[], filterStore: IStateStore) => P[]

const defaultComparer: IEqual = (filterState, dataValue) =>
  filterState === dataValue

export function useFilter<P>(
  data: P[],
  keys: IStateKey = {},
  filters?: IFilters,
  treater: Itreater<P> = (income: P[]) => income
): [P[], IStateStore, IStateSetter] {
  const [filterStore, setFilterStoreByKey] = useParams(keys)

  return [
    treater(
      filters
        ? data.filter(item =>
            Object.keys(filters).every(key => {
              const comparer = filters[key].equals
                ? filters[key].equals
                : defaultComparer

              return comparer!(filterStore[key], item[key])
            })
          )
        : data,
      filterStore
    ),
    filterStore,
    setFilterStoreByKey,
  ]
}
