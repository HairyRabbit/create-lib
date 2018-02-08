/**
 * parse argv options
 *
 * @flow
 */

import fs from 'fs'
import path from 'path'
import parse from 'yargs-parser'
import DefaultOptions from './defaultOptions'
import type { Options } from './'

export default function parseArgs(args: Array<string>): Options {
  const opts = parse(args, {
    alias: {
      devDeps: 'd',
      deps: 'p'
    },
    array: ['d', 'p'],
    default: DefaultOptions
  })

  /**
   * set name and dir path
   */
  const required = opts._
  let name, dir
  if(!required.length) {
    throw new Error('The lib name was required.')
  } else {
    name = required[0]
    if(required[1]) {
      dir = path.resolve(required[1])
    } else {
      dir = path.resolve(name)
    }
  }

  /**
   * assert warning if dir path exists
   *
   * 1. path was not exists
   * 2. path exists but not a directory
   * 3. path exists and a directory but not empty
   */
  let dirExists
  if(fs.existsSync(dir)) {
    const stat = fs.statSync(dir)
    if(!stat.isDirectory()) {
      throw new Error(`Path ${dir} not a directory`)
    } else if(fs.readdirSync(dir).length) {
      throw new Error(`Path ${dir} not empty`)
    } else {
      dirExists = true
    }
  } else {
    dirExists = false
  }

  /**
   * set platform
   */
  const platform = [
    'cli',
    'helper',
    'webpack-loader',
    'webpack-config',
    'react'
  ].sort().reduce((acc, curr) => {
    return opts[curr] ? curr : acc
  }, DefaultOptions.platform)

  return {
    name,
    dir,
    dirExists,
    platform,
    jest: opts.jest,
    flow: opts.flow,
    lodash: opts.lodash,
    devDeps: opts.d,
    deps: opts.p
  }
}
