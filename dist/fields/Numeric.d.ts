/// <reference types="numeral" />
import { INumericField, ChartType, IFieldExcludeKind } from './types';
import { Value } from './Value';
export declare class Numeric extends Value<number> {
    numeral: Numeral;
    decimals: number;
    chartType?: ChartType;
    isPercent?: boolean;
    value: number;
    protected readonly defaultFormatString: string;
    constructor(value: number, numericField: IFieldExcludeKind<INumericField>);
    format: (formatString?: string | undefined) => string;
}
