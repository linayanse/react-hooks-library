import { isObject, isArray, isNumber, isString, isRegExp } from 'lodash';
import { FieldKind, } from './types';
import { Date } from './Date';
import { Currency } from './Currency';
import { Numeric } from './Numeric';
import { Presentation } from './Presentation';
export function decorateModel(data, defintions) {
    if (isObject(data)) {
        Object.keys(data).forEach(function (key) {
            var value = data[key];
            var defintion = defintions[key];
            if (isNumber(value) || isString(value) || isRegExp(value)) {
                if (defintion) {
                    data[key] = createModel(value, defintion);
                }
            }
            else {
                data[key] = decorateModel(value, defintions);
            }
        });
        return data;
    }
    else if (isArray(data)) {
        return data.map(function (item) { return decorateModel(item, defintions); });
    }
    return data;
}
function createModel(value, defintion) {
    switch (defintion.kind) {
        case FieldKind.Date:
            return new Date(value, {
                displayName: defintion.displayName,
            });
        case FieldKind.Currency:
            return new Currency(value, {
                displayName: defintion.displayName,
                chartType: defintion.chartType,
                decimals: defintion.decimals,
                isPercent: defintion.isPercent,
            });
        case FieldKind.Numeric:
            return new Numeric(value, {
                displayName: defintion.displayName,
                chartType: defintion.chartType,
                decimals: defintion.decimals,
                isPercent: defintion.isPercent,
            });
        case FieldKind.Presentation:
            return new Presentation(value, {
                displayName: defintion.displayName,
                valueMapper: defintion.valueMapper,
            });
        default:
            return value;
    }
}
