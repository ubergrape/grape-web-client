/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
'use strict';

var Emitter = require('emitter');

var exports = module.exports = LPSocket;

function LPSocket(uri) {
	Emitter.call(this);
	var self = this;

	// get longpolling endpoints
	this.ajax({
		method: 'PUT', 
		path: uri,
		success: function (xhr) {
		  var resp = JSON.parse(xhr.responseText);
			self.pollUri = resp.poll;
			self.pushUri = resp.push;
			self.currentPoll = undefined;
			self.poll();
			self.emit('open');
		},
		error: function(xhr) {
			self.emit('error', xhr.responseText);
		}
	});
};

LPSocket.prototype = Object.create(Emitter.prototype);

LPSocket.prototype.poll = function LPSocket_poll() {
	if (this.pollUri === undefined) {
		// cannot poll without uri
		this.emit("error", "No poll URL specified");
		return;
	}
	var self = this;
	this.currentPoll = this.ajax({
		method: 'GET',
		path: this.pollUri,
		success: function(xhr) {
			console.log(JSON.parse(xhr.responseText));
			self.emit('message', xhr.responseText);
			self.poll();
		},
		error: function(xhr) {
			if (xhr.status == 404) {
				// session expired or invalid; reconnect!
				self.pollUri = undefined;
			  self.emit('close', xhr.status);
			} else {
				self.emit('error', xhr.status);
			}
		}
	});
};

LPSocket.prototype.send = function LPSocket_send(msg) {
	if (this.pushUri === undefined) {
		// cannot poll without uri
		this.emit("error", "No push URL specified");
		return;
	}
	var self = this;
	this.ajax({
		method: 'POST',
		path: this.pushUri,
		data: msg,
		error: function(xhr) {
			if (xhr.status == 404) {
				// session expired or invalid; reconnect!
				self.pushUri = undefined;
			  self.emit('close', xhr.status);
			} else {
				self.emit('error', xhr.status);
			}
		}
	});
};

LPSocket.prototype.close = function LPSocket_close(whatisthis) {
	if (this.currentPoll !== undefined) {
		this.currentPoll.abort();
	}
	return null
};

LPSocket.prototype.ajax = function LPSocket_ajax(opts) {
	var xhr;
	if (window.XMLHttpRequest) {
		xhr = new XMLHttpRequest();
	} else {
		xhr = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xhr.onreadystatechange = function() {
		if (xhr.readyState == XMLHttpRequest.DONE ) {
			if(xhr.status == 200 && opts.success !== undefined){
				opts.success(xhr);
			}
			else if (xhr.status == 0) {
				// aborted. doing nothing.
			}
			else if (xhr.status != 200 && opts.error !== undefined) {
				opts.error(xhr);
			}
		}
	}
	xhr.open(opts.method, opts.path, true);
	xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xhr.send(JSON.stringify(opts.data));
	return xhr;
};

