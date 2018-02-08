/**
 * @jest
 */

test('output should be came case', () => {
  const cameCase = require('../src/cameCase').default
  expect(cameCase('foo-bar')).toBe('fooBar')
})

test('output should be came case with multi', () => {
  const cameCase = require('../src/cameCase').default
  expect(cameCase('foo-bar-baz')).toBe('fooBarBaz')
})

test('output should keep input', () => {
  const cameCase = require('../src/cameCase').default
  expect(cameCase('foo')).toBe('foo')
})

test('should be blank string', () => {
  const cameCase = require('../src/cameCase').default
  expect(cameCase('')).toBe('')
})
