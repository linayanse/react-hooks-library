export enum FieldKind {
  // 展示
  Presentation = 1,
  // 日期
  Date = 2,
  // 数值
  Numeric = 10,
  // 货币
  Currency = 11,
}

export enum ChartType {
  LINE,
  BAR,
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
  chartType?: ChartType
}

export interface ICurrencyField extends IField {
  kind: FieldKind.Currency
  decimals: number
  isPercent?: boolean
  chartType?: ChartType
}

export interface IPresentationField extends IField {
  kind: FieldKind.Presentation
  valueMapper?: { [key: string]: string }
}

export interface IDateField extends IField {
  kind: FieldKind.Date
}
