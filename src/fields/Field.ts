import { IField, IFieldExcludeKind } from './types'

export class Field implements IFieldExcludeKind<IField> {
  public displayName: string
  // 显示名称

  constructor(field: IFieldExcludeKind<IField>) {
    this.displayName = field.displayName
  }
}
