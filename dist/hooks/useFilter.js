import { useParams } from './useParams';
var defaultComparer = function (filterState, dataValue) {
    return filterState === dataValue;
};
export function useFilter(data, keys, filters, treater) {
    if (treater === void 0) { treater = function (income) { return income; }; }
    var _a = useParams(keys), filterStore = _a[0], setFilterStoreByKey = _a[1];
    return [
        treater(data.filter(function (item) {
            return Object.keys(filters).every(function (key) {
                var comparer = filters[key].equals
                    ? filters[key].equals
                    : defaultComparer;
                return comparer(filterStore[key], item[key]);
            });
        }), filterStore),
        filterStore,
        setFilterStoreByKey,
    ];
}
