/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Emitter = require('emitter');
var Upload = require('upload');
var Progress = require('progress');
var file = require('file');
var template = require('template');
var qs = require('query');
var render = require('../rendervdom');
var classes = require('classes');

module.exports = Uploader;

function Uploader(uploadPath) {
	Emitter.call(this);
	this.uploadPath = uploadPath;
	this.org = {id: 0};
	this.init();
	this.bind();
}

Uploader.prototype = Object.create(Emitter.prototype);

Uploader.prototype.init = function Uploader_init() {
	var vdom = template('fileuploader', {});
	render(this, vdom);
	this.classes = classes(this.el);

	this.input = qs('input', this.el);
	this.trigger = qs('.trigger', this.el);
	// append progress widget
	this.progress = new Progress();
	this.progress.size(100);
	qs('.progress', this.el).appendChild(this.progress.el);
	// get the preview container
	this.preview = qs('.preview', this.el);
};

Uploader.prototype.bind = function Uploader_bind() {
	var self = this;
	this.trigger.addEventListener('click', function () { self.input.click(); });
	this.input.addEventListener('change', function (ev) {
		var file = this.files[0];
		self.showPreview(file);
		var upload = new Upload(file);
		upload.on('progress', function (percent) {
			self.progress.update(percent);
		});
		upload.to({
			path: self.uploadPath,
			data: {organization: self.org.id}
		}, function (err, res) {
			console.log(arguments);
		});
	});
};

Uploader.prototype.setOrganization = function Uploader_setOrganization(org) {
	this.org = org;
};

Uploader.prototype.showPreview = function Uploader_updatePreview(f) {
	var self = this;
	this.progress.update(0);
	file(f).toDataURL(function (err, url) {
		self.preview.src = url;
		self.classes.add('open');
	});
};

Uploader.prototype.hide = function Uploader_hide() {
	this.classes.remove('open');
};
