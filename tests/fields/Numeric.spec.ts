import { Numeric } from '../../src/fields'
import { ChartType } from '../../src/fields/types'

describe('Model Numeric', () => {
  const numeric = new Numeric(1, {
    decimals: 2,
    chartType: ChartType.BAR,
    isPercent: false,
    displayName: '测试',
  })

  it('should create instance', () => {
    expect(JSON.stringify(numeric)).toMatchSnapshot()
  })

  it('should have defaultFormatString', () => {
    chaiExpect(numeric['defaultFormatString']).to.be.equal('0,0.00')
  })

  it('should have format function', () => {
    chaiExpect(numeric.format()).to.be.equal('1.00')

    numeric.value = 10000

    chaiExpect(numeric.format()).to.be.equal('10,000.00')
    chaiExpect(numeric.format('0.0')).to.be.equal('10000.0')
  })
})
