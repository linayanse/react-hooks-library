import { Field } from './Field';
var Value = /** @class */ (function () {
    function Value(value, field) {
        this.value = value;
        this.field = new Field(field);
    }
    return Value;
}());
export { Value };
