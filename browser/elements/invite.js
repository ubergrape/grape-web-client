/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Emitter = require('emitter');
var events = require('events');
var qs = require('query');
var render = require('../rendervdom');
var template = require('template');
var textcomplete = require('textcomplete');
var _ = require('t');

module.exports = Invite;

function Invite() {
	Emitter.call(this);
	this.room = new Emitter({name: ''});
	this.init();
	this.bind();
}

Invite.prototype = Object.create(Emitter.prototype);

Invite.prototype.init = function Invite_init() {
	this.redraw();
}

Invite.prototype.bind = function Invite_bind() {
	this.events = events(this.el, this);
	this.events.bind('submit .invite-to-room', 'inviteToRoom');
	this.events.bind('input .input-invite', 'resetvalidity');
	// this.events.bind('click .btn-invite', 'resetvalidity');
	this._bindAutocomplete();
};

Invite.prototype.redraw = function Invite_redraw() {
	render(this, template('invite', {room: this.room}));
}

Invite.prototype._bindAutocomplete = function Invite__bindAutocomplete() {
	var self = this;
	this.inviteInput = qs('.input-invite', this.el);
	var el = qs('.autocomplete', this.el);
	if (el !== null) {
		this.complete = textcomplete(this.inviteInput, el);
		this.complete.re = /([\w.+-]+)$/;
		this.complete.formatSelection = function (option) {
			return option.insert + ", ";
		}
		this.complete.query = function (matches) {
			var match = matches[0];

			self.complete.clear();

			var users = app.organization.users;
			for (var i=0; i<users.length; i++) {
				var user = users[i];
				if (  user.firstName.startsWithIgnoreCase(match)
				   || user.lastName.startsWithIgnoreCase(match)
				   || user.username.startsWithIgnoreCase(match)) {
					self.complete.push({
						id: user.username,
						title: '<span class="entry-type-icon type-chatgrapeuser">&nbsp;</span>' + user.username + ': <img src="' + user.avatar + '" width="16" alt="Avatar of ' + user.firstName + ' ' + user.lastName + '" style="border-radius:50%;margin-bottom:-3px;"/>&nbsp;'+ user.firstName + ' ' + user.lastName,
						insert: user.username,
					});
				}
			}

			self.complete.show();
			self.complete.highlight(0);
		};
	}

	this.inviteButton = qs('.btn-invite', this.el);
};

Invite.prototype.inviteToRoom = function Invite_inviteToRoom(ev) {
	ev.preventDefault();
	this.resetvalidity();

	var self = this;
	if (this.inviteInput.value === "") {
		self.inviteInput.setCustomValidity(_("Please enter at least one user to invite"));
		self.inviteButton.click();
		return;
	}

	var users = this.inviteInput.value.split(/[\s,;]+/);
	users.clean("");

	self.emit('invitetoroom', this.room, users, function inviteToRoom_callback(err, result){
		if(err) {
			self.inviteInput.setCustomValidity(err.details);
			self.inviteButton.click()
		}else {
			self.inviteInput.value = '';
			alert("invited " + users.length + " users.");
		}
	});
};

Invite.prototype.resetvalidity = function Invite_resetvalidity() {
	this.inviteInput.setCustomValidity('');
};

Invite.prototype.setRoom = function Invite_setRoom(room) {
	this.room = room;
	this.redraw();
}

// TODO: put this in component
Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
	if (this[i] == deleteValue) {
	  this.splice(i, 1);
	  i--;
	}
  }
  return this;
};