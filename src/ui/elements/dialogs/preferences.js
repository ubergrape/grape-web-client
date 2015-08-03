/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Dialog = require('./dialog');

var events = require('events');
var qs = require('query');
var _ = require('t');

module.exports = PreferencesDialog;

function PreferencesDialog(context) {
	this.template_path = 'dialogs/preferences.jade';
	Dialog.call(this, context);
}

PreferencesDialog.prototype = Object.create(Dialog.prototype);

PreferencesDialog.prototype.bind = function PreferencesDialog_bind() {
	this.events = events(this.el, this);

	this.events.bind('click input.compactmode', 'toggleCompactMode');
};
PreferencesDialog.prototype.toggleCompactMode = function PreferencesDialog_toggleCompactMode(ev) {
	console.log("COMPACT MODE TOGGLED");
};

