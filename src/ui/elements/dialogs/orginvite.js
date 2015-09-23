var Dialog = require('./dialog');
var events = require('events');
var qs = require('query');
var _ = require('t');

module.exports = OrgInvite;

function OrgInvite(context) {
	this.template_path = 'dialogs/orginvite.jade';
	Dialog.call(this, context);
}

OrgInvite.prototype = Object.create(Dialog.prototype);

OrgInvite.prototype.bind = function () {
	this.events = events(this.el, this);
	this.events.bind('input .input-invite', 'resetValidity');
	this.events.bind('submit .invite-to-org', 'inviteToOrg');
}

OrgInvite.prototype.inviteToOrg = function (ev) {
	ev.preventDefault();
	var inviteInput = qs('.input-invite', this.el);
	var inviteButton = qs('.btn-invite', this.el);
	this.resetValidity();
	if (inviteInput.value === '') {
		inviteInput.setCustomValidity(_('Please enter at least one user to invite'));
		setTimeout(function() {inviteButton.click();}.bind(this), 500)
		return;
	}
	inviteButton.disabled = true;
	this.emit('inviteToOrg', inviteInput.value, function(err, res) {
		if (err) {
			inviteInput.setCustomValidity(_('Enter valid email addresses separated by a space.'));
			inviteButton.disabled = false;
			setTimeout(function() {inviteButton.click();}.bind(this), 500)	
		} else {
			this.dialog.hide();
		}
	}.bind(this));
}

OrgInvite.prototype.resetValidity = function () {
	var inviteInput = qs('.input-invite', this.el);
	inviteInput.setCustomValidity('');
}