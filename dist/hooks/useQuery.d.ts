export interface IQueryProps {
    variable?: object;
    pollInterval?: number;
    skip?: boolean;
    query?(params?: object): Promise<any>;
}
export declare function useQuery(props: IQueryProps): {
    data: undefined;
    clear: () => void;
    loading: boolean;
    error: undefined;
    refetch: () => Promise<any>;
    startPolling: (interval: number) => void;
    stopPolling: () => void;
};
