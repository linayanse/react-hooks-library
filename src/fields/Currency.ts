import numeral from 'numeral'

import { Numeric } from './Numeric'

export class Currency extends Numeric {
  public get yuan(): number {
    return numeral(this.numeral)
      .divide(100)
      .value()
  }

  public format = (formatString?: string) => {
    return numeral(this.yuan).format(formatString || this.defaultFormatString)
  }
}
