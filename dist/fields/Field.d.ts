import { IField, IFieldExcludeKind } from './types';
export declare class Field implements IFieldExcludeKind<IField> {
    displayName: string;
    constructor(field: IFieldExcludeKind<IField>);
}
