import template from 'template'
import v from 'virtualdom'
import domify from 'domify'

template.locals.strftime = require('strftime')
template.locals._ = require('t')
template.locals.escape_html = require('escape-html')
template.locals.markdown = require('../ui/markdown')
template.locals.constants = require('conf').constants
template.locals.html = (html) => {
  return v.fromDOM(domify(html))
}

template.templates = {
  'chathistory.jade': require('./chathistory.jade'),
  'dialogs/deleteroom.jade': require('./dialogs/deleteroom.jade'),
  'dialogs/room-invite.jade': require('./dialogs/room-invite.jade'),
  'dialogs/invite-form-content.jade': require('./dialogs/invite-form-content.jade'),
  'dialogs/markdowntips.jade': require('./dialogs/markdowntips.jade'),
  'dialogs/menu.jade': require('./dialogs/menu.jade'),
  'dialogs/pmlist.jade': require('./dialogs/pmlist.jade'),
  'dialogs/pmmanager.jade': require('./dialogs/pmmanager.jade'),
  'dialogs/room-creation-form.jade': require('./dialogs/room-creation-form.jade'),
  'dialogs/roomlist.jade': require('./dialogs/roomlist.jade'),
  'dialogs/roommanager.jade': require('./dialogs/roommanager.jade'),
  'dialogs/userlist.jade': require('./dialogs/userlist.jade'),
  'dialogs/orginvite.jade': require('./dialogs/orginvite.jade'),
  'draganddrop.jade': require('./draganddrop.jade'),
  'fileuploader.jade': require('./fileuploader.jade'),
  'grapeInput.jade': require('./grapeInput.jade'),
  'index.jade': require('./index.jade'),
  'popovers/organization.jade': require('./popovers/organization.jade')
}
