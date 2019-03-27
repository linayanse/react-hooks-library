import numeral from 'numeral'

import { INumericField, IFieldExcludeKind } from './types'
import { Value } from './Value'

export class Numeric extends Value<number> {
  public numeral: Numeral
  public decimals: number
  public isPercent?: boolean

  protected get defaultFormatString(): string {
    if (this.decimals > 0) {
      return `0,0.${'0'.repeat(this.decimals)}`
    }

    return '0,0'
  }

  public get presentation() {
    return this.format()
  }

  public get value(): number {
    return this.numeral.value()
  }

  public set value(newValue: number) {
    this.numeral = numeral(newValue)
  }

  constructor(value: number, numericField: IFieldExcludeKind<INumericField>) {
    super(value, numericField)

    this.numeral = numeral(value)
    this.decimals = numericField.decimals
    this.isPercent = numericField.isPercent
  }

  public calcTrend = (compare?: number) => {
    if (compare == undefined || compare === 0 || Number.isNaN(compare)) {
      return undefined
    }

    return numeral(this.value)
      .subtract(compare)
      .divide(compare)
      .value()
  }

  public format = (formatString?: string) => {
    return this.numeral.format(formatString || this.defaultFormatString)
  }

  public clone = (value?: number) => {
    return new Numeric(value || this.value, {
      decimals: this.decimals,
      displayName: this.field.displayName,
      isPercent: this.isPercent,
    })
  }
}
