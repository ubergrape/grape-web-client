/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Dialog = require('./dialog');

var events = require('events');
var qs = require('query');
var classes = require('classes');
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
	this.events.bind('click input.darkmode', 'toggleDarkMode');
};

PreferencesDialog.prototype.toggleCompactMode = function PreferencesDialog_toggleCompactMode(ev) {
	toggleBodyClass(ev.target.checked, "compact");
	this.emit('compactmodechange', ev.target.checked);
};

PreferencesDialog.prototype.toggleDarkMode = function PreferencesDialog_toggleDarkMode(ev) {
	toggleBodyClass(ev.target.checked, "dark");
	this.emit('darkmodechange', ev.target.checked);
};

var toggleBodyClass = function toggleBodyClass(condition, classname) {
	if(condition) {
		classes(qs('body')).add(classname);
	} else {
		classes(qs('body')).remove(classname);
	}
};