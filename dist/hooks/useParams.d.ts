export interface IStateKey {
    [key: string]: {
        value?: any;
        defaultValue?: any;
        onChange?(newValue: any): void;
    };
}
export interface IStateStore {
    [key: string]: any;
}
export declare type IStateSetter = (key: string | number) => (newValue: any) => void;
export declare function useParams(stateKeys: IStateKey): [IStateStore, IStateSetter];
