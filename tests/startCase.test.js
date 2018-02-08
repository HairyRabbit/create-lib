/**
 * @jest
 */

test('output should be start case', () => {
  const startCase = require('../src/startCase').default
  expect(startCase('foo')).toBe('Foo')
})

test('should be blank string', () => {
  const startCase = require('../src/startCase').default
  expect(startCase('')).toBe('')
})
