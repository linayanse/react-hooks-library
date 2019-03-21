import { Value, Field } from '../../src/fields'

describe('Model Value', () => {
  it('should create instance', () => {
    const field = new Value(
      1,
      new Field({
        displayName: '测试',
      })
    )

    expect(JSON.stringify(field)).toMatchSnapshot()
  })
})
