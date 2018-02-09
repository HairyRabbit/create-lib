/**
 * create a webpack plugin project
 *
 * @flow
 */

import fs from 'fs'
import path from 'path'
import exec from '../execPromise'
import rmrf from '../rmrfPromise'
import render from '../templateRender'
import writeTemplate from '../templateOverrider'
import cameCase from '../cameCase'
import startCase from '../startCase'
import type { Options } from '../'

export default function create(options: Options): Promise<*> {
  /**
   * mkdir if dir not exits, then cd to target dir
   */
  if(!options.dirExists) {
    fs.mkdirSync(options.dir)
  }
  const oldDir = process.cwd()
  process.chdir(options.dir)

  return exec('npm init -y')
    .then(() => {
      const pkgPath = path.resolve(options.dir, 'package.json')
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
      pkg.version = '0.0.1'
      pkg.main = 'lib/index.js'
      pkg.license = 'GPL-3.0'
      pkg.scripts = {}
      pkg.scripts['start'] = 'yarn build'
      pkg.scripts['prepublish'] = 'yarn test && yarn build:prod'
      pkg.scripts['build'] = 'cross-env NODE_ENV=development yarn rollup -c'
      pkg.scripts['build:prod'] = 'cross-env NODE_ENV=production yarn rollup -c'
      if(options.flow) {
        pkg.scripts['build:type'] = `flow gen-flow-files src/index.js > lib/${options.name}.js.flow`
      }
      if(options.jest) {
        pkg.scripts['test'] = 'jest'
        pkg.scripts['test:coverage'] = 'yarn test --coverage'
      }
      if(options.flow) {
        pkg.scripts['test:type'] = 'flow check'
      }
      pkg.files = ['lib']
      pkg.peerDependencies = { webpack: '^2 | ^3' }
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf-8')
      return
    })
    .then(() => {
      writeTemplate('.editorconfig', options.dir)
      writeTemplate('LICENSE', options.dir)
      writeTemplate('.gitignore', options.dir, content => content + `
# Project
lib
`)
      fs.writeFileSync(path.resolve(options.dir, 'README.md'), `\
${options.name}
----
`, 'utf-8')
    })
    .then(() => {
      const srcPath = path.resolve(options.dir, 'src')
      fs.mkdirSync(srcPath)
      writeTemplate('index.js', srcPath, content => {
        content = content.replace(/{{NAME}}/, options.name)
        content = render(content, 'FLOW', options.flow)
        return content
      }, 'index.webpack-plugin.js')

      writeTemplate('plugin.js', srcPath, content => {
        content = content.replace(/{{NAME}}/, startCase(cameCase(options.name)))
        content = render(content, 'FLOW', options.flow)
        return content
      })

      writeTemplate('defaultOptions.js', srcPath, content => {
        content = render(content, 'FLOW', options.flow)
        return content
      })

      const testPath = path.resolve(options.dir, 'tests')
      fs.mkdirSync(testPath)
      writeTemplate('index.test.js', testPath)
    })
    .then(() => {
      writeTemplate('.babelrc', options.dir, content => {
        const opt = JSON.parse(content)
        if(!options.flow) {
          opt.presets = opt.filter(preset => '@babel/preset-flow' !== preset)
        }
        if(options.lodash) {
          opt.plugins.push('babel-plugin-lodash')
        }
        return JSON.stringify(opt, null, 2)
      })
      if(options.flow) {
        writeTemplate('.flowconfig', options.dir)
      }

      writeTemplate('rollup.config.js', options.dir)
    })
    .then(() => {
      const { devDeps, deps } = options
      return Promise.all([
        exec('yarn add -D ' + [].concat(
          '@babel/core',
          '@babel/plugin-proposal-class-properties',
          '@babel/plugin-syntax-dynamic-import',
          '@babel/preset-env',
          options.flow ? ['@babel/preset-flow', 'flow-bin'] : [],
          options.jest ? ['babel-core@^7.0.0-bridge.0', 'babel-jest', 'jest'] : [],
          options.lodash ? 'babel-plugin-lodash' : [],
          'rollup',
          'rollup-plugin-babel@^4.0.0-beta.1',
          'rollup-plugin-commonjs',
          'rollup-plugin-json',
          'rollup-plugin-node-resolve',
          'webpack',
          devDeps
        ).join(' ')),
        deps.length ? exec(`yarn add ${deps.join(' ')}`) : Promise.resolve()
      ])
    })
    .then(() => {
      return exec(`yarn test`)
    })
    .catch(err => {
      process.chdir(oldDir)
      if(!options.dirExists) {
        return rmrf(options.dir)
      }
      throw err
    })
}
