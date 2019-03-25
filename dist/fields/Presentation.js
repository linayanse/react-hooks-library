import * as tslib_1 from "tslib";
import { Value } from './Value';
var Presentation = /** @class */ (function (_super) {
    tslib_1.__extends(Presentation, _super);
    function Presentation(value, presentationField) {
        var _this = _super.call(this, value, presentationField) || this;
        _this.valueMapper = presentationField.valueMapper;
        return _this;
    }
    Object.defineProperty(Presentation.prototype, "valueDisplayName", {
        get: function () {
            if (this.valueMapper !== undefined) {
                return this.valueMapper[this.value];
            }
            return this.value;
        },
        enumerable: true,
        configurable: true
    });
    return Presentation;
}(Value));
export { Presentation };
