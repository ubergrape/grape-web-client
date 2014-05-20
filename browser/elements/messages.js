var Emitter = require('emitter');
var render = require('../rendervdom');
var template = require('template');
var qs = require('query');

module.exports = Messages;

function Messages() {
	Emitter.call(this);
	this.redraw = this.redraw.bind(this);
	this.init();
	this.redraw();
}

Messages.prototype = Object.create(Emitter.prototype);

Messages.prototype.init = function() {
	this.messages = [];
}

Messages.prototype.redraw = function() {
	var vdom = template('messages', {messages: this.messages});
	render(this, vdom)
}

Messages.prototype.add = function(message, type) {
	this.messages.push({'text': message, 'type': type});
	this.redraw();
}

Messages.prototype.clear = function() {
	this.messages = [];
}
