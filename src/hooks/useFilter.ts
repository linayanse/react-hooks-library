import { IStateKey, IStateStore, IStateSetter, useParams } from './useParams'

interface IFilters {
  [key: string]: {
    equals: ((filterState: any, dataValue: any) => boolean) | undefined
  }
}

type Itreater = (data: any[], filterStore: IStateStore) => any[]

const defaultComparer = (filterState: any, dataValue: any) =>
  filterState === dataValue

export function useFilter(
  data: any[],
  keys: IStateKey,
  filters: IFilters,
  treater: Itreater = (income: any[]) => income
): [any, IStateStore, IStateSetter] {
  const [filterStore, setFilterStoreByKey] = useParams(keys)

  return [
    treater(
      data.filter(item =>
        Object.keys(filters).every(key => {
          const comparer = filters[key].equals
            ? filters[key].equals!
            : defaultComparer

          return comparer(filterStore[key], item[key])
        })
      ),
      filterStore
    ),
    filterStore,
    setFilterStoreByKey,
  ]
}
