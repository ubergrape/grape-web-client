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
	if (ev.target.checked) {
		classes(document.body).add('client-style-compact');
		classes(document.body).remove('normal-style');
		classes(document.body).remove('client-style-normal');
	} else {
		classes(document.body).add('normal-style');
		classes(document.body).remove('client-style-compact');
		classes(document.body).add('client-style-normal');
	}

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

PreferencesDialog.prototype.preferencesChanged = function PreferencesDialog_preferencesChanged(ev) {
	this.redraw();
	this.closable(); // lol hack
};
