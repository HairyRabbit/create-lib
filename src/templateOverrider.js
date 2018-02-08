/**
 * copy template from x to y
 *
 * @flow
 */

import fs from 'fs'
import path from 'path'

export default function writeTemplate(template: string,
                                      dir: string,
                                      override?: string => string = x => x,
                                      templateName?: string): void {
  const templateFileName = `${templateName || template}.template`
  const templatePath = path.resolve(__dirname, `../templates/${templateFileName}`)
  if(!fs.existsSync(templatePath)) {
    throw new Error(`Can't find ${templateFileName} in ${templatePath}`)
  }
  const targetPath = path.resolve(dir, template)
  const templateContent = fs.readFileSync(templatePath, 'utf-8')
  fs.writeFileSync(targetPath, override(templateContent), 'utf-8')
}
