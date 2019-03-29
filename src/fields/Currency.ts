import numeral from 'numeral'

import { Numeric } from './Numeric'

export class Currency extends Numeric {
  public get presentation() {
    return this.format()
  }

  public get yuan(): number {
    return numeral(this.numeral)
      .divide(100)
      .value()
  }

  public get fuzzyYuan(): number {
    return numeral(this.presentation).value()
  }

  public get kind() {
    return Currency
  }

  public static isCurrency<P>(model: P) {
    return model instanceof Currency
  }

  public format = (formatString?: string) => {
    return numeral(this.yuan).format(formatString || this.defaultFormatString)
  }

  public clone = (value?: number) => {
    return new Currency(value || this.value, {
      decimals: this.decimals,
      displayName: this.field.displayName,
      isPercent: this.isPercent,
    })
  }
}
