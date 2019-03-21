import moment, { Moment } from 'moment'

import { IDateField, IFieldExcludeKind } from './types'
import { Value } from './Value'

export class Date extends Value<string> {
  public moment: Moment

  constructor(value: string, field: IFieldExcludeKind<IDateField>) {
    super(value, field)

    this.moment = moment(value)
  }

  public format = (formatString = 'YYYY-MM-DD') => {
    return this.moment.format(formatString)
  }
}
