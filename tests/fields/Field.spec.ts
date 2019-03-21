import { Field } from '../../src/fields'

describe('Model Field', () => {
  it('should create instance', () => {
    const field = new Field({
      displayName: '测试',
    })

    expect(JSON.stringify(field)).toMatchSnapshot()
  })
})
