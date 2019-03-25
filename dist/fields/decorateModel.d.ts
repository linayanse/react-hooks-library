import { INumericField, ICurrencyField, IPresentationField, IDateField } from './types';
export interface IDefintion {
    [key: string]: INumericField | ICurrencyField | IPresentationField | IDateField;
}
export declare function decorateModel(data: object | object[], defintions: IDefintion): object | object[];
