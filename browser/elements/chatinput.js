'use strict';

var Emitter = require('emitter');
var template = require('template');
var render = require('../rendervdom');

function ChatInput() {
    Emitter.call(this);
}
ChatInput.prototype = Object.create(Emitter.prototype);
module.exports = ChatInput

ChatInput.prototype.setRoom = function(room) {

};

ChatInput.prototype.render = function() {
    var vdom = template('chatinput.jade', {});
    render(this, vdom);
};
