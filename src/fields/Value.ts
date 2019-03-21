import { IFieldExcludeKind, IField } from './types'
import { Field } from './Field'

export class Value<P> {
  public value: P
  public field: Field

  constructor(value: P, field: IFieldExcludeKind<IField>) {
    this.value = value
    this.field = new Field(field)
  }
}
