import { Presentation } from '../../src/fields'

describe('Model Presentation', () => {
  const presentation = new Presentation('test', {
    displayName: '测试',
  })

  it('should create instance', () => {
    expect(JSON.stringify(presentation)).toMatchSnapshot()
  })

  it('should have valueDisplayName', () => {
    expect(presentation.valueDisplayName).toBe('test')

    presentation.valueMapper = {
      test: '测试',
    }

    expect(presentation.valueDisplayName).toBe('测试')
  })
})
