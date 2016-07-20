import * as fs from 'fs'
import {sync} from 'glob'

const MESSAGES_PATTERN = './i18n/import/*.json'
const OUTPUT_DIR = './src/i18n/'

sync(MESSAGES_PATTERN).map((file) => {
  const filename = file.split('/').pop().split('.').slice(0, -1).join('.')
  const parsed = JSON.parse(fs.readFileSync(file, 'utf8'))
  const messages = Object.keys(parsed).reduce((result, key) => {
    const message = parsed[key].defaultMessage || parsed[key]
    result[key] = message
    return result
  }, {})

  const output =
`/* eslint-disable */
/**
 * This is auto-generated file.
 * DON'T EDIT!
 */
export default ${JSON.stringify(messages, null, 2)}`

  fs.writeFileSync(`${OUTPUT_DIR}${filename}.js`, output)
})
