import { IFieldExcludeKind, IPresentationField } from './types'
import { Value } from './Value'

export class Text extends Value<string> {
  public valueMapper?: IPresentationField['valueMapper']

  public get presentation() {
    return this.valueDisplayName
  }

  public get valueDisplayName(): string {
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

  public clone = (value?: string) => {
    return new Text(value || this.value, {
      displayName: this.field.displayName,
      valueMapper: this.valueMapper,
    })
  }
}
