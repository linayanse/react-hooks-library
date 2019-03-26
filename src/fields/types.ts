export enum FieldKind {
  // 展示
  Text = 1,
  // 日期
  Date = 2,
  // 数值
  Numeric = 10,
  // 货币
  Currency = 11,
}

export interface IField {
  kind: FieldKind
  displayName: string
}

export type IFieldExcludeKind<P> = Pick<P, Exclude<keyof P, 'kind'>>

export interface INumericField extends IField {
  kind: FieldKind.Numeric
  decimals: number
  isPercent?: boolean
}

export interface ICurrencyField extends IField {
  kind: FieldKind.Currency
  decimals: number
  isPercent?: boolean
}

export interface IPresentationField extends IField {
  kind: FieldKind.Text
  valueMapper?: { [key: string]: string }
}

export interface IDateField extends IField {
  kind: FieldKind.Date
}
