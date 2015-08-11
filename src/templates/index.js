var template = require('template')

template.templates = {
	'chatheader.jade': require('./chatheader.jade'),
	'rightsidebar.jade': require('./rightsidebar.jade'),
	'uploads.jade': require('./uploads.jade'),
	'roommembers.jade': require('./roommembers.jade'),
	'chathistory.jade': require('./chathistory.jade'),
	'dialogs/deleteroom.jade': require('./dialogs/deleteroom.jade'),
	'dialogs/invite.jade': require('./dialogs/invite.jade'),
	'dialogs/markdowntips.jade': require('./dialogs/markdowntips.jade'),
	'draganddrop.jade': require('./draganddrop.jade'),
	'fileuploader.jade': require('./fileuploader.jade'),
	'grapeinputintegration.jade': require('./grapeinputintegration.jade'),
	'index.jade': require('./index.jade'),
	'messages.jade': require('./messages.jade'),
	'navigation.jade': require('./navigation.jade'),
	'pmlist.jade': require('./pmlist.jade'),
	'pmlist-compact.jade': require('./pmlist-compact.jade'),
	'popovers/organization.jade': require('./popovers/organization.jade'),
	'popovers/roommanager.jade': require('./popovers/roommanager.jade'),
	'popovers/roomlist.jade': require('./popovers/roomlist.jade'),
	'popovers/user.jade': require('./popovers/user.jade'),
	'roomlist.jade': require('./roomlist.jade'),
	'roomlist-compact.jade': require('./roomlist-compact.jade'),
	'searchresults.jade': require('./searchresults.jade'),
	'typingnotifications.jade': require('./typingnotifications.jade')
}
