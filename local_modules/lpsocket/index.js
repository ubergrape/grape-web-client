/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
'use strict';

var Emitter = require('emitter');

var exports = module.exports = LPSocket;

function LPSocket(uri) {
	Emitter.call(this);
	this.pollUri = undefined;
	this.pushUri = undefined;
	this.xhr = undefined;

};

LPSocket.prototype = Object.create(Emitter.prototype);

LPSocket.prototype.connect = function LPSocket_connect() {
	// initialize a long polling session
	this.ajax({
		method: 'PUT', 
		path: uri,
		success: function (xhr) {
		  var resp = JSON.parse(xhr.responseText);
		  // the responded urls already contain the 
			// sessionId for the new session
			this.pollUri = resp.poll;
			this.pushUri = resp.push;
			this.poll();
			this.emit('open');
		}.bind(this),
		error: function(xhr) {
			this.emit('error', xhr.responseText);
		}.bind(this)
	});
};

LPSocket.prototype.poll = function LPSocket_poll() {
	if (this.pollUri === undefined) {
		// cannot poll without uri
		this.emit("error", "No poll URL specified");
		return;
	}
	this.xhr = this.ajax({
		method: 'GET',
		path: this.pollUri,
		success: function(xhr) {
			this.emit('message', xhr.responseText);
			this.poll();
		}.bind(this),
		error: function(xhr) {
			if (xhr.status == 404) {
				// session expired or invalid; reconnect!
				this.pollUri = undefined;
				this.emit('close', xhr.status);
			} else {
				this.emit('error', xhr.status);
			}
		}.bind(this)
	});
};

LPSocket.prototype.send = function LPSocket_send(msg) {
	if (this.pushUri === undefined) {
		// cannot poll without uri
		this.emit("error", "No push URL specified");
		return;
	}
	this.ajax({
		method: 'POST',
		path: this.pushUri,
		data: msg,
		error: function(xhr) {
			if (xhr.status == 404) {
				// session expired or invalid; reconnect!
				this.pushUri = undefined;
			  this.emit('close', xhr.status);
			} else {
				this.emit('error', xhr.status);
			}
		}.bind(this)
	});
};

LPSocket.prototype.close = function LPSocket_close(whatisthis) {
	if (this.xhr !== undefined) {
		this.xhr.abort();
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

