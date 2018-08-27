// eslint-disable-next-line import/no-extraneous-dependencies
const theo = require('theo')
const fs = require('fs')
const camelCase = require('lodash/camelCase')
const mapKeys = require('lodash/mapKeys')

theo.registerTransform('web', ['color/hex'])

theo
  .convert({
    transform: {
      type: 'web',
      file: './node_modules/design-system/design-tokens/grape-skin.yml',
    },
    format: {
      type: 'json',
    },
  })
  .then(json => {
    const theme = {}
    mapKeys(JSON.parse(json), (v, k) => {
      theme[camelCase(k)] = v
    })
    fs.writeFile(
      './src/constants/theme.json',
      JSON.stringify(theme, null, ' '),
      'utf8',
      () => {},
    )
  })
  .catch(error => {
    // eslint-disable-next-line no-console
    console.log(`Something went wrong: ${error}`)
  })
