import { IStateKey, IStateStore, IStateSetter } from './useParams';
interface IFilters {
    [key: string]: {
        equals: ((filterState: any, dataValue: any) => boolean) | undefined;
    };
}
declare type Itreater = (data: any[], filterStore: IStateStore) => any[];
export declare function useFilter(data: any[], keys: IStateKey, filters: IFilters, treater?: Itreater): [any, IStateStore, IStateSetter];
export {};
