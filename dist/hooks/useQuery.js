import * as tslib_1 from "tslib";
import { useState, useEffect } from 'react';
import { isEqual } from 'lodash';
import { usePrevious } from './usePrevious';
import { decorateModel } from '../fields';
export function useQuery(props) {
    var _this = this;
    var _a = useState(undefined), data = _a[0], setData = _a[1];
    var _b = useState(undefined), error = _b[0], setError = _b[1];
    var _c = useState(false), loading = _c[0], setLoading = _c[1];
    var _d = useState(undefined), intervalIndex = _d[0], setIntervalIndex = _d[1];
    var prevVariable = usePrevious(props.variable);
    var isVariableChange = function () {
        if (props.variable === undefined ||
            !isEqual(prevVariable, props.variable)) {
            return true;
        }
        return false;
    };
    var clear = function () {
        setData(undefined);
    };
    var queryTransaction = function (skip) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var query, response, error_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(!skip && props.query)) return [3 /*break*/, 4];
                    setLoading(true);
                    query = props.query(props.variable);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, query];
                case 2:
                    response = _a.sent();
                    if (response) {
                        if (response.defintions) {
                            setData(tslib_1.__assign({}, response, { data: decorateModel(response.data, response.defintions) }));
                        }
                        else {
                            setData(response);
                        }
                        setLoading(false);
                    }
                    else {
                        clear();
                        setLoading(false);
                    }
                    return [2 /*return*/, response];
                case 3:
                    error_1 = _a.sent();
                    setError(error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
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
        clear: clear,
        loading: loading,
        error: error,
        refetch: refetch,
        startPolling: startPolling,
        stopPolling: stopPolling,
    };
}
