var template = require('template')
var render = require('../rendervdom')

module.exports = Dropzone

function Dropzone(){
  var vdom = template('draganddrop.jade', {})
  render(this, vdom)
}
