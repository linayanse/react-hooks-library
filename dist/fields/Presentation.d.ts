import { IFieldExcludeKind, IPresentationField } from './types';
import { Value } from './Value';
export declare class Presentation extends Value<string> {
    valueMapper?: object;
    readonly valueDisplayName: string;
    constructor(value: string, presentationField: IFieldExcludeKind<IPresentationField>);
}
