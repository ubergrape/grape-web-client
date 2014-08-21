/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

//var should = require('chaijs-chai').should();
var template = require('template');

var UI = require('cg').UI;

template.locals.user = {avatar: "", username:"test"};

describe('Cipboard', function () {
	it('should be automaticallly initialized', function (done) {
		var ui = new UI();
		ui.clipboard.should.not.be.an('undefined');
		done();
	});
	it('should handle paste event', function (done) {
		var ui = new UI();
		ui.clipboard.on('paste', function (){
			done();
		});
		var BlobBuilder = window.WebKitBlobBuilder || window.MozBlobBuilder;
		var builder = new BlobBuilder();
		builder.append('<img src = "http://www.sunmaster.co.uk/destination-guides/mainImage/egypt.jpg">');
		var blob = builder.getBlob('text/html');
		var ev = document.createEvent('CustomEvent');
		ev.initCustomEvent('paste');
		//ev.keyCode = 13;
		ev.items = [blob];
		window.dispatchEvent(ev);
	});
	it('should emit upload event when the pasted file is blob', function (done) {
		var ui = new UI();
		ui.upload.on('upload', function (){
			done();
		});
		var BlobBuilder = window.WebKitBlobBuilder || window.MozBlobBuilder;
		var builder = new BlobBuilder();
		builder.append('<img src = "http://www.sunmaster.co.uk/destination-guides/mainImage/egypt.jpg">');
		var blob = builder.getBlob('text/html');
		var ev = document.createEvent('CustomEvent');
		ev.initCustomEvent('paste');
		//ev.keyCode = 13;
		ev.items = [blob];
		window.dispatchEvent(ev);
		//ui.emit('paste', ev);
	});
});

