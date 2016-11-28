import template from 'template';
import render from '../rendervdom';

module.exports = Dropzone

function Dropzone(){
  let vdom = template('draganddrop.jade', {})
  render(this, vdom)
}
