import * as fs from 'fs'
import {extractFromCode} from 'i18n-extract'

const MESSAGES = './dist/app.js'
const EXPORT_DIR = './i18n/export/'

const keys = extractFromCode(fs.readFileSync(MESSAGES, 'utf8'), {
  marker: '_'
})

const messages = keys.reduce((_messages, message) => {
  _messages[message] = message
  return _messages
}, {})

fs.writeFileSync(`${EXPORT_DIR}/legacy.en.json`, JSON.stringify(messages, null, 2))
