import { Date } from '../../src/fields'

describe('Model Numeric', () => {
  const date = new Date('2012-11-11', {
    displayName: '测试',
  })

  it('should create instance', () => {
    expect(JSON.stringify(date)).toMatchSnapshot()
  })

  it('should have format function', () => {
    chaiExpect(date.format()).to.be.equal('2012-11-11')

    chaiExpect(date.format('YYYY-MM-DD HH:mm:ss')).to.be.equal(
      '2012-11-11 00:00:00'
    )
  })
})
