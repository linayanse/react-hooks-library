import * as tslib_1 from "tslib";
import { useState, useEffect } from 'react';
import { isEqual } from 'lodash';
import { usePrevious } from './usePrevious';
import { decorateModel } from '../fields';
export function useQuery(props) {
    var _this = this;
    var _a = useState(props.initialData), data = _a[0], setData = _a[1];
    var _b = useState(undefined), error = _b[0], setError = _b[1];
    var _c = useState(false), loading = _c[0], setLoading = _c[1];
    var _d = useState(undefined), intervalIndex = _d[0], setIntervalIndex = _d[1];
    var _e = useState(false), isCalled = _e[0], setIsCalled = _e[1];
    var prevVariable = usePrevious(props.variable);
    var isVariableChange = function () {
        if (!isCalled || !isEqual(prevVariable, props.variable)) {
            return true;
        }
        return false;
    };
    var reset = function () {
        setData(props.initialData);
    };
    var queryTransaction = function (skip, variable) {
        if (variable === void 0) { variable = props.variable; }
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var response;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(!skip && props.query)) return [3 /*break*/, 2];
                        setLoading(true);
                        setIsCalled(true);
                        return [4 /*yield*/, props.query(variable)];
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
    var refetch = function () { return queryTransaction(false); };
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
        if (isVariableChange()) {
            queryTransaction(props.skip || false);
        }
    }, [props.skip, props.variable]);
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
