/**
 * render template with flag and default value
 *
 * @flow
 */

export default function render(content: string, flag: string, predicate: boolean): string {
  const splitBeg = '{{'
  const splitEnd = '}}'
  const regexpBeg = new RegExp(`${splitBeg}${flag}:`)
  const regexpEnd = new RegExp(`${splitEnd}`)
  while(true) {
    const result = regexpBeg.exec(content)
    if(result) {
      const begin = result.index
      const end = regexpEnd.exec(content).index
      const value = content.slice(begin + splitBeg.length + flag.length + 1, end)
      const left = content.slice(0, begin)
      const right = content.slice(end + splitEnd.length)
      if(predicate) {
        content = left + value + right
      } else {
        content = left + right
      }
    } else {
      break
    }
  }
  return content
}
