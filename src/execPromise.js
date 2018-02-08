/**
 * exec as a promise
 *
 * @flow
 */

import { exec } from 'child_process'

export default function execPromise(cmd: string, options: Object = {}): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(cmd, options, (err, stdout, stderr) => {
      if(err) {
        reject(err)
      } else if(stderr) {
        resolve(stderr.toString())
      }

      resolve(stdout.toString())
    })
  })
}
