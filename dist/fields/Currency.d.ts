import { Numeric } from './Numeric';
export declare class Currency extends Numeric {
    readonly yuan: number;
    format: (formatString?: string | undefined) => string;
}
