var template = require('template')

template.templates = {
	'chatheader.jade': require('./chatheader.jade'),
	'chathistory.jade': require('./chathistory.jade'),
	'dialogs/deleteroom.jade': require('./dialogs/deleteroom.jade'),
	'draganddrop.jade': require('./draganddrop.jade'),
	'dialogs/markdowntips.jade': require('./dialogs/markdowntips.jade'),
	'fileuploader.jade': require('./fileuploader.jade'),
	'grapeinputintegration.jade': require('./grapeinputintegration.jade'),
	'index.jade': require('./index.jade'),
	'invite.jade': require('./invite.jade'),
	'messages.jade': require('./messages.jade'),
	'navigation.jade': require('./navigation.jade'),
	'pmlist.jade': require('./pmlist.jade'),
	'popovers/organization.jade': require('./popovers/organization.jade'),
	'popovers/roommanager.jade': require('./popovers/roommanager.jade'),
	'popovers/roomlist.jade': require('./popovers/roomlist.jade'),
	'popovers/roommembers.jade': require('./popovers/roommembers.jade'),
	'popovers/user.jade': require('./popovers/user.jade'),
	'roomlist.jade': require('./roomlist.jade'),
	'searchresults.jade': require('./searchresults.jade'),
	'typingnotifications.jade': require('./typingnotifications.jade')
}
