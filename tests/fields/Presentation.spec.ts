import { Presentation } from '../../src/fields'

describe('Model Presentation', () => {
  const presentation = new Presentation('test', {
    displayName: '测试',
  })

  it('should create instance', () => {
    expect(JSON.stringify(presentation)).toMatchSnapshot()
  })

  it('should have valueDisplayName', () => {
    chaiExpect(presentation.valueDisplayName).to.be.equal('test')

    presentation.valueMapper = {
      test: '测试',
    }

    chaiExpect(presentation.valueDisplayName).to.be.equal('测试')
  })
})
