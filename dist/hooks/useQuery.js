import * as tslib_1 from "tslib";
import { useState, useEffect } from 'react';
import { isEqual, merge } from 'lodash';
import { usePrevious } from './usePrevious';
import { decorateModel } from '../fields';
export function useQuery(props) {
    var _this = this;
    var defaultProps = {
        skip: false,
        autoQuery: true,
    };
    var mergedProps = merge(defaultProps, props);
    var _a = useState(mergedProps.initialData), data = _a[0], setData = _a[1];
    var _b = useState(undefined), error = _b[0], setError = _b[1];
    var _c = useState(false), loading = _c[0], setLoading = _c[1];
    var _d = useState(undefined), intervalIndex = _d[0], setIntervalIndex = _d[1];
    var _e = useState(false), isCalled = _e[0], setIsCalled = _e[1];
    var prevVariable = usePrevious(mergedProps.variable);
    var isShouldQuery = function () {
        // the first time
        if (!isCalled) {
            if (!mergedProps.skip) {
                return true;
            }
        }
        else if (mergedProps.autoQuery) {
            if (!isEqual(prevVariable, mergedProps.variable)) {
                return true;
            }
        }
        return false;
    };
    var reset = function () {
        setData(mergedProps.initialData);
    };
    var queryTransaction = function (variable) {
        if (variable === void 0) { variable = mergedProps.variable; }
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var response;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!mergedProps.query) return [3 /*break*/, 2];
                        setLoading(true);
                        setIsCalled(true);
                        return [4 /*yield*/, mergedProps.query(variable)];
                    case 1:
                        response = _a.sent();
                        try {
                            if (response) {
                                if (response['defintions']) {
                                    setData(tslib_1.__assign({}, response, { data: decorateModel(response['data'], response['defintions']) }));
                                }
                                else {
                                    setData(response);
                                }
                                setLoading(false);
                            }
                            else {
                                reset();
                                setLoading(false);
                            }
                            return [2 /*return*/, response];
                        }
                        catch (error) {
                            setError(error);
                            return [2 /*return*/, response];
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/, undefined];
                }
            });
        });
    };
    var refetch = queryTransaction;
    var startPolling = function (interval) {
        setIntervalIndex(window.setInterval(queryTransaction, interval));
    };
    var stopPolling = function () {
        if (intervalIndex !== undefined) {
            window.clearInterval(intervalIndex);
            setIntervalIndex(undefined);
        }
    };
    // fetch data
    useEffect(function () {
        if (isShouldQuery()) {
            queryTransaction();
        }
    }, [mergedProps.variable]);
    return {
        data: data,
        reset: reset,
        loading: loading,
        error: error,
        refetch: refetch,
        startPolling: startPolling,
        stopPolling: stopPolling,
    };
}
