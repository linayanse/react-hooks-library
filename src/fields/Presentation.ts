import { IFieldExcludeKind, IPresentationField } from './types'
import { Value } from './Value'

export class Presentation extends Value<string> {
  public valueMapper?: object

  get valueDisplayName(): string {
    if (this.valueMapper !== undefined) {
      return this.valueMapper[this.value]
    }

    return this.value
  }

  constructor(
    value: string,
    presentationField: IFieldExcludeKind<IPresentationField>
  ) {
    super(value, presentationField)

    this.valueMapper = presentationField.valueMapper
  }
}
