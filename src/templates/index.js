var template = require('template')
var v = require('virtualdom')
var domify = require('domify')

template.locals.strftime = require('strftime')
template.locals._ = require('t')
template.locals.escape_html = require('escape-html')
template.locals.markdown = require('../ui/markdown')
template.locals.constants = require('conf').constants
template.locals.html = function (html) {
    return v.fromDOM(domify(html))
}

template.templates = {
    'chatheader.jade': require('./chatheader.jade'),
    'rightsidebar.jade': require('./rightsidebar.jade'),
    'roommembers.jade': require('./roommembers.jade'),
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
    'messages.jade': require('./messages.jade'),
    'navigation.jade': require('./navigation.jade'),
    'pmlist.jade': require('./pmlist.jade'),
    'pmlist-collapsed.jade': require('./pmlist-collapsed.jade'),
    'popovers/organization.jade': require('./popovers/organization.jade'),
    'roomlist.jade': require('./roomlist.jade'),
    'roomlist-collapsed.jade': require('./roomlist-collapsed.jade'),
    'searchresults.jade': require('./searchresults.jade'),
    'typingnotifications.jade': require('./typingnotifications.jade'),
    'user-profile.jade': require('./user-profile.jade')
}

