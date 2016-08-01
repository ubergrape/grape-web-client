import * as fs from 'fs'
import {extractFromCode} from 'i18n-extract'

const messagesSrc = './dist/app.js'
const exportDir = './i18n/export/'
const lastImport = JSON.parse(fs.readFileSync('./i18n/import/legacy.en.json', 'utf8'))

const keys = extractFromCode(fs.readFileSync(messagesSrc, 'utf8'), {
  marker: '_'
})

const messages = keys.reduce((_messages, message) => {
  // use edited value from last import or create new from source
  _messages[message] = lastImport[message] || message
  return _messages
}, {})

fs.writeFileSync(`${exportDir}/legacy.en.json`, JSON.stringify(messages, null, 2))
