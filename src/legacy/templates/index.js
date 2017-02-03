import template from 'template'
import v from 'virtualdom'
import domify from 'domify'

template.locals._ = require('t')
template.locals.constants = require('../../conf').constants
template.locals.html = html => v.fromDOM(domify(html))

template.templates = {
  'dialogs/deleteroom.jade': require('./dialogs/deleteroom.jade'),
  'dialogs/invite-form-content.jade': require('./dialogs/invite-form-content.jade'),
  'dialogs/menu.jade': require('./dialogs/menu.jade'),
  'dialogs/roomlist.jade': require('./dialogs/roomlist.jade'),
  'dialogs/userlist.jade': require('./dialogs/userlist.jade'),
  'grapeInput.jade': require('./grapeInput.jade')
}
