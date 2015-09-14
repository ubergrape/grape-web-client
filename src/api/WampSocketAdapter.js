'use strict';

var Client = require('lpio-client');
var Emitter = require('emitter');
var conf = require('conf');

/**
 * Adapter for WAMP1.
 */
function Socket() {
    Emitter.call(this);
    this.client = new Client({url: conf.pubsubUrl});
}

Socket.prototype = Object.create(Emitter.prototype);
module.exports = Socket;

Socket.prototype.connect = function Socket__connect() { 
    var channel = this.client.connect();
    channel.on('data', function(data) {
        this.emit('message', data);
    }.bind(this));
    return channel;
};

Socket.prototype.send = function Socket__send(data) { 
    this.client.send({data: data});
};
