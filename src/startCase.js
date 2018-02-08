/**
 * start case string
 *
 * @flow
 */

export default function startCase(input: string): string {
  return input.replace(/^(\w)/, (_, a) => a.toUpperCase())
}
