import moment, { Moment } from 'moment'

import { IDateField, IFieldExcludeKind } from './types'
import { Value } from './Value'

export class Date extends Value<string> {
  public moment: Moment

  public get presentation() {
    return this.format()
  }

  public get kind() {
    return Date
  }

  constructor(value: string, field: IFieldExcludeKind<IDateField>) {
    super(value, field)

    this.moment = moment(value)
  }

  public format = (formatString = 'YYYY-MM-DD') => {
    return this.moment.format(formatString)
  }

  public clone = (value?: string) => {
    return new Date(value || this.value, {
      displayName: this.field.displayName,
    })
  }
}
