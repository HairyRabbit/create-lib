/**
 * came case string
 *
 * @flow
 */

export default function cameCase(input: string): string {
  return input.replace(/(-\w)/g, (_, a) => a.substr(1).toUpperCase())
}
