/**
 * create a lib project
 *
 * syntax:
 *
 *   create-lib name dir
 *     [|--cli
 *      | --helper
 *      | --webpack-plugin
 *      | --webpack-loader
 *      | --react
 *      | --lerna(not supports)>]
 *     [--no-flow]
 *     [--no-jest]
 *     [--lodash]
 *     [-d ...devdependencies] [-p ...dependencies]
 *
 * process:
 *
 * 1. run `npm init -y` generate a `package.json` file
 * 2. patch `package.json` files
 * 3. add basic config files
 *   - .gitigore
 *   - .editorconfig
 *   - LICENSE
 *   - README.md
 * 4. add project files
 *   - src/index.js
 *   - src/cli.js (when cli option was set)
 * 5. add babel config file `.babelrc` and flow config file `.flowconfig`
 * 6. add rollup config file `rollup.config.js`
 * 7. patch `.gitigore` file, append `lib` `cli` directory to the file end
 * 8. patch `.babelrc` if lodash was set or a react component lib project
 * 9. patch `rollup.config.js` if cli options was set
 * 10. install dependencies
 * 11. run basic test
 *
 * @flow
 */

import parse from './argsParser'
import * as platforms from './platforms'

export type Options = {
  name: string,
  dir: string,
  dirExists: boolean,
  platform:
    | 'cli'
    | 'helper'
    | 'webpack-plugin'
    | 'webpack-loader'
    | 'react'
    | 'lerna',
  flow: boolean,
  jest: boolean,
  lodash: boolean,
  devDeps: Array<string>,
  deps: Array<string>
}

export default function createLib(args: Array<string>) {
  const options = parse(args)
  const { platform } = options
  platforms[platform](options)
}
