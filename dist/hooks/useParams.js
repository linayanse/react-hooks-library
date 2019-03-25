import * as tslib_1 from "tslib";
import { useState, useEffect } from 'react';
import { isEqual } from 'lodash';
import { usePrevious } from './usePrevious';
function isControlled(value) {
    return value !== undefined;
}
// 创建Store
var createStore = function (keys) {
    return Object.keys(keys).reduce(function (total, key) {
        var _a = keys[key], value = _a.value, defaultValue = _a.defaultValue;
        if (defaultValue) {
            total[key] = defaultValue;
        }
        else {
            total[key] = value;
        }
        return total;
    }, {});
};
export function useParams(stateKeys) {
    var _a = useState(createStore(stateKeys)), stateStore = _a[0], setStateStore = _a[1];
    var prevStateKeys = usePrevious(stateKeys);
    var setStateByKey = function (key) { return function (newValue) {
        var _a;
        var sourceState = stateKeys[key];
        if (!isControlled(sourceState[key])) {
            setStateStore(tslib_1.__assign({}, stateStore, (_a = {},
                _a[key] = newValue,
                _a)));
        }
        if (typeof sourceState.onChange === 'function') {
            sourceState.onChange(newValue);
        }
    }; };
    useEffect(function () {
        if (!isEqual(prevStateKeys, stateKeys)) {
            setStateStore(createStore(stateKeys));
        }
    }, [stateKeys]);
    return [stateStore, setStateByKey];
}
