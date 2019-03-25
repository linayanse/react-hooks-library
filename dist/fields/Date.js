import * as tslib_1 from "tslib";
import moment from 'moment';
import { Value } from './Value';
var Date = /** @class */ (function (_super) {
    tslib_1.__extends(Date, _super);
    function Date(value, field) {
        var _this = _super.call(this, value, field) || this;
        _this.format = function (formatString) {
            if (formatString === void 0) { formatString = 'YYYY-MM-DD'; }
            return _this.moment.format(formatString);
        };
        _this.moment = moment(value);
        return _this;
    }
    return Date;
}(Value));
export { Date };
