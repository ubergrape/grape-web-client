let template = require('template')
let render = require('../rendervdom')

module.exports = Dropzone

function Dropzone(){
  let vdom = template('draganddrop.jade', {})
  render(this, vdom)
}
