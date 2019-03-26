import { isObject, isArray, isNumber, isString, isRegExp } from 'lodash'

import {
  INumericField,
  ICurrencyField,
  IPresentationField,
  IDateField,
  FieldKind,
} from './types'
import { Date } from './Date'
import { Currency } from './Currency'
import { Numeric } from './Numeric'
import { Text } from './Text'

export interface IDefintion {
  [key: string]:
    | INumericField
    | ICurrencyField
    | IPresentationField
    | IDateField
}

export function decorateModel(
  data: object | object[],
  defintions: IDefintion
): object | object[] {
  if (isObject(data)) {
    Object.keys(data).forEach(key => {
      const value = data[key]
      const defintion = defintions[key]

      if (isNumber(value) || isString(value) || isRegExp(value)) {
        if (defintion) {
          data[key] = createModel(value, defintion)
        }
      } else {
        data[key] = decorateModel(value, defintions)
      }
    })

    return data
  } else if (isArray(data)) {
    return (data as object[]).map(item => decorateModel(item, defintions))
  }

  return data
}

function createModel(value: any, defintion: IDefintion[keyof IDefintion]): any {
  switch (defintion.kind) {
    case FieldKind.Date:
      return new Date(value, {
        displayName: defintion.displayName,
      })
    case FieldKind.Currency:
      return new Currency(value, {
        displayName: defintion.displayName,
        decimals: defintion.decimals,
        isPercent: defintion.isPercent,
      })
    case FieldKind.Numeric:
      return new Numeric(value, {
        displayName: defintion.displayName,
        decimals: defintion.decimals,
        isPercent: defintion.isPercent,
      })
    case FieldKind.Text:
      return new Text(value, {
        displayName: defintion.displayName,
        valueMapper: defintion.valueMapper,
      })
    default:
      return value
  }
}
