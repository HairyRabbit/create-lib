/**
 * rm -rf return a promise
 *
 * @flow
 */

import rimraf from 'rimraf'

export default function rmrfPromise(path: string): Promise<void> {
  return new Promise((resolve, reject) => {
    rimraf(path, err => {
      if(err) {
        reject(err)
        return
      }

      resolve()
    })
  })
}
