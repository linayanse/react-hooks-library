import { Moment } from 'moment';
import { IDateField, IFieldExcludeKind } from './types';
import { Value } from './Value';
export declare class Date extends Value<string> {
    moment: Moment;
    constructor(value: string, field: IFieldExcludeKind<IDateField>);
    format: (formatString?: string) => string;
}
