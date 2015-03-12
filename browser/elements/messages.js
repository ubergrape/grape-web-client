var Emitter = require('emitter');
var render = require('../rendervdom');
var template = require('template');
var animate = require('animate');

module.exports = Messages;

function Message(type, level, options) {
	this.type = type;
	this.level = level;
	this.options = options;
}

Message.prototype.add = function (messages) {
	messages.add(this);
	this.messages = messages;
};

Message.prototype.remove = function () {
	animate(this, 'fade-up-out');
	setTimeout(this.messages.remove(this), 2000);
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
	var vdom = template('messages.jade', {messages: this.messages});
	render(this, vdom);
};

Messages.prototype.add = function(msg) {
	this.messages.push(msg);
	this.redraw();
};

Messages.prototype.create = function(type, level, options) {
	var msg = new Message(type, level, options);
	msg.add(this);
	animate(this, 'fade-down-in');
	this.redraw();
	return msg;
};

Messages.prototype.remove = function(message) {
	var idx = this.messages.indexOf(message);
	if (idx > -1) this.messages.splice(idx, 1);
	this.redraw();
};

Messages.prototype.info = function(type, options) {
	return this.create(type, 'info', options);
};

Messages.prototype.success = function(type, options) {
	return this.create(type, 'success', options);
};

Messages.prototype.warning = function(type, options) {
	return this.create(type, 'warning', options);
};

Messages.prototype.danger = function(type, options) {
	return this.create(type, 'danger', options);
};

Messages.prototype.clear = function() {
	this.messages = [];
	this.redraw();
};
