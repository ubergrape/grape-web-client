import * as fs from 'fs'
import {extractFromCode} from 'i18n-extract'

const messagesSrc = './dist/app.js'
const exportDir = './i18n/export/'

const keys = extractFromCode(fs.readFileSync(messagesSrc, 'utf8'), {
  marker: '_'
})

const messages = keys.reduce((_messages, message) => {
  _messages[message] = message
  return _messages
}, {})

fs.writeFileSync(`${exportDir}/legacy.en.json`, JSON.stringify(messages, null, 2))
