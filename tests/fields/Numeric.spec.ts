import { Numeric } from '../../src/fields'

describe('Model Numeric', () => {
  const numeric = new Numeric(1, {
    decimals: 2,
    isPercent: false,
    displayName: '测试',
  })

  it('should create instance', () => {
    expect(JSON.stringify(numeric)).toMatchSnapshot()
  })

  it('should have defaultFormatString', () => {
    expect(numeric['defaultFormatString']).toBe('0,0.00')
  })

  it('should have format function', () => {
    expect(numeric.format()).toBe('1.00')

    numeric.value = 10000

    expect(numeric.format()).toBe('10,000.00')
    expect(numeric.format('0.0')).toBe('10000.0')
  })
})
