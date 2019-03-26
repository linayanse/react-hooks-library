import { Currency } from '../../src/fields'

describe('Model Currency', () => {
  const currency = new Currency(100, {
    decimals: 2,
    isPercent: false,
    displayName: '测试',
  })

  it('should create instance', () => {
    expect(JSON.stringify(currency)).toMatchSnapshot()
  })

  it('should have yuan', () => {
    expect(currency.yuan).toBe(1)
  })

  it('should have format function', () => {
    expect(currency.format()).toBe('1.00')

    currency.value = 1000000

    expect(currency.format()).toBe('10,000.00')
    expect(currency.format('0.0')).toBe('10000.0')
  })
})
