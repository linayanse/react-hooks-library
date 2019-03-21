import { Currency } from '../../src/fields'
import { ChartType } from '../../src/fields/types'

describe('Model Currency', () => {
  const currency = new Currency(100, {
    decimals: 2,
    chartType: ChartType.BAR,
    isPercent: false,
    displayName: '测试',
  })

  it('should create instance', () => {
    expect(JSON.stringify(currency)).toMatchSnapshot()
  })

  it('should have yuan', () => {
    chaiExpect(currency.yuan).to.be.equal(1)
  })

  it('should have format function', () => {
    chaiExpect(currency.format()).to.be.equal('1.00')

    currency.value = 1000000

    chaiExpect(currency.format()).to.be.equal('10,000.00')
    chaiExpect(currency.format('0.0')).to.be.equal('10000.0')
  })
})
