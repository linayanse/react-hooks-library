import numeral from 'numeral'

import { INumericField, ChartType, IFieldExcludeKind } from './types'
import { Value } from './Value'

export class Numeric extends Value<number> {
  public numeral: Numeral
  public decimals: number
  public chartType?: ChartType
  public isPercent?: boolean

  public get value(): number {
    return this.numeral.value()
  }

  public set value(newValue: number) {
    this.numeral = numeral(newValue)
  }

  protected get defaultFormatString(): string {
    if (this.decimals > 0) {
      return `0,0.${'0'.repeat(this.decimals)}`
    }

    return '0,0'
  }

  constructor(value: number, numericField: IFieldExcludeKind<INumericField>) {
    super(value, numericField)

    this.numeral = numeral(value)
    this.decimals = numericField.decimals
    this.chartType = numericField.chartType
    this.isPercent = numericField.isPercent
  }

  public format = (formatString?: string) => {
    return this.numeral.format(formatString || this.defaultFormatString)
  }
}
