import * as tslib_1 from "tslib";
import numeral from 'numeral';
import { Value } from './Value';
var Numeric = /** @class */ (function (_super) {
    tslib_1.__extends(Numeric, _super);
    function Numeric(value, numericField) {
        var _this = _super.call(this, value, numericField) || this;
        _this.format = function (formatString) {
            return _this.numeral.format(formatString || _this.defaultFormatString);
        };
        _this.numeral = numeral(value);
        _this.decimals = numericField.decimals;
        _this.chartType = numericField.chartType;
        _this.isPercent = numericField.isPercent;
        return _this;
    }
    Object.defineProperty(Numeric.prototype, "value", {
        get: function () {
            return this.numeral.value();
        },
        set: function (newValue) {
            this.numeral = numeral(newValue);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Numeric.prototype, "defaultFormatString", {
        get: function () {
            if (this.decimals > 0) {
                return "0,0." + '0'.repeat(this.decimals);
            }
            return '0,0';
        },
        enumerable: true,
        configurable: true
    });
    return Numeric;
}(Value));
export { Numeric };
