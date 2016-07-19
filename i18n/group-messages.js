import * as fs from 'fs'
import {sync as globSync} from 'glob'

const MESSAGES_PATTERN = './i18n/src/**/*.json'
const LANG_DIR = './i18n/'

// Aggregates the default messages that were extracted from the example app's
// React components via the React Intl Babel plugin. An error will be thrown if
// there are messages in different components that use the same `id`. The result
// is a flat collection of `id: message` pairs for the app's default locale.
const defaultMessages = globSync(MESSAGES_PATTERN)
    .map((filename) => fs.readFileSync(filename, 'utf8'))
    .map((file) => JSON.parse(file))
    .reduce((collection, descriptors) => {
      descriptors.forEach(({id, defaultMessage, description}) => {
        if (collection.hasOwnProperty(id)) {
          throw new Error(`Duplicate message id: ${id}`)
        }

        collection[id] = {
          defaultMessage,
          description
        }
      })

      return collection
    }, {})

fs.writeFileSync(LANG_DIR + 'en-dev.json', JSON.stringify(defaultMessages, null, 2))
