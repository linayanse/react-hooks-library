import { IFieldExcludeKind, IField } from './types';
import { Field } from './Field';
export declare class Value<P> {
    value: P;
    field: Field;
    constructor(value: P, field: IFieldExcludeKind<IField>);
}
