const theo = require('theo') // eslint-disable-line import/no-extraneous-dependencies
const fs = require('fs')
const camelCase = require('lodash/camelCase')
const mapKeys = require('lodash/mapKeys')
const download = require('download-git-repo') // eslint-disable-line import/no-extraneous-dependencies

download('ubergrape/design-system', 'design-system', err => {
  if (err) throw err
  theo.registerTransform('web', ['color/hex'])
  theo
    .convert({
      transform: {
        type: 'web',
        file: './design-system/design-tokens/grape-skin.yml',
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
      console.log(`Error: ${error}`)
    })
})
