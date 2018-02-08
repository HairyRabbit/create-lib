/**
 * render template with flag and default value
 *
 * @flow
 */

export default function render(content: stirng, flag: string, predicate: boolean): string {
  const regexp = new RegExp(`{{${flag}:?`, 'g')
  while(regexp.exec(content)) {

  }
  if(predicate) {
    return content.replace(regexp, (_, a) => a)
  } else {
    return content.replace(regexp, '')
  }
}
