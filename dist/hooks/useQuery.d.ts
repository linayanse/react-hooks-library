export interface IQueryProps<P> {
    initialData?: P;
    variable?: object;
    pollInterval?: number;
    skip?: boolean;
    query?(params?: object): Promise<P>;
}
export declare function useQuery<P>(props: IQueryProps<P>): {
    data: P | undefined;
    clear: () => void;
    loading: boolean;
    error: any;
    refetch: () => Promise<P | undefined>;
    startPolling: (interval: number) => void;
    stopPolling: () => void;
};
