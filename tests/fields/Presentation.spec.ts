import { Text } from '../../src/fields'

describe('Model Presentation', () => {
  const text = new Text('test', {
    displayName: '测试',
  })

  it('should create instance', () => {
    expect(JSON.stringify(text)).toMatchSnapshot()
  })

  it('should have valueDisplayName', () => {
    expect(text.valueDisplayName).toBe('test')

    text.valueMapper = {
      test: '测试',
    }

    expect(text.valueDisplayName).toBe('测试')
  })
})
