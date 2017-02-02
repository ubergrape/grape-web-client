const exports = module.exports = require('component-emitter')({})

exports.state = 'focus'

window.addEventListener('blur', () => {
  exports.state = 'blur'
  exports.emit('change', exports.state)
  exports.emit('blur')
})
window.addEventListener('focus', () => {
  exports.state = 'focus'
  exports.emit('change', exports.state)
  exports.emit('focus')
})

