/**
 * @jest
 */

test('should render template with default value', () => {
  const render = require('../src/templateRender').default
  expect(render('{{FOO:bar}}', 'FOO', true)).toBe('bar')
})

test('should render template with blank string', () => {
  const render = require('../src/templateRender').default
  expect(render('{{FOO:bar}}', 'FOO', false)).toBe('')
})

test('should render template with global match', () => {
  const render = require('../src/templateRender').default
  expect(render('{{FOO:bar}}{{FOO:baz}}', 'FOO', true)).toBe('barbaz')
})

test('should render template with close RT', () => {
  const render = require('../src/templateRender').default
  expect(render('{{FOO:a}}}', 'FOO', true)).toBe('a}')
})

test('should render template with newline and close RT', () => {
  const render = require('../src/templateRender').default
  expect(render(`{{FOO:
a}
}}`, 'FOO', true)).toBe('\na}\n')
})
