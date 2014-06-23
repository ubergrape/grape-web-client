var Emitter = require('emitter');
var render = require('../rendervdom');
var template = require('template');
var Animate = require('animate');

module.exports = Messages;

function Message(text, level) {
	this.text = text;
	this.level = level;
}

Message.prototype.add = function (messages) {
	messages.add(this);
	this.messages = messages;
};

Message.prototype.remove = function () {
	this.messages.remove(this);
	delete this.messages;
};

function Messages() {
	Emitter.call(this);
	this.redraw = this.redraw.bind(this);
	this.init();
	this.redraw();
}

Messages.prototype = Object.create(Emitter.prototype);

Messages.prototype.init = function() {
	this.messages = [];
};

Messages.prototype.redraw = function() {
	var vdom = template('messages', {messages: this.messages});
	render(this, vdom)
};

Messages.prototype.add = function(msg) {
	this.messages.push(msg);
	this.redraw();
};

Messages.prototype.create = function(text, level) {
	var msg = new Message(text, level);
	msg.add(this);
	this.redraw();
	Animate(this, 'fade-left-in');
	return msg;
};

Messages.prototype.remove = function(message) {
	var idx = this.messages.indexOf(message);
	if (idx > -1) {
			this.messages.splice(idx, 1);
	}
	this.redraw();
};

Messages.prototype.info = function(text) {
	return this.create(text, 'info');
};

Messages.prototype.success = function(text) {
	return this.create(text, 'success');
};

Messages.prototype.warning = function(text) {
	return this.create(text, 'warning');
};

Messages.prototype.danger = function(text) {
	return this.create(text, 'danger');
};

Messages.prototype.clear = function() {
	this.messages = [];
	this.redraw();
};
