const { createMacro } = require('babel-plugin-macros')
const { version } = require('../../package.json')

module.exports = createMacro(({ references, babel }) => {
  const { default: grapeVersion = [] } = references
  grapeVersion.forEach(reference => {
    reference.replaceWith(babel.types.stringLiteral(version))
  })
})
