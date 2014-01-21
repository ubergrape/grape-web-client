/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

module.exports = Adapter;

function Adapter(uri, fn) {
	if (typeof uri === 'function') {
		fn = uri;
		uri = '';
	}
	return function (Model) {
		Model.prototype.unsubscribe = function () {
			Adapter.channel.unsubscribe(this._uri, this._subscription);
		};
		Model.on('construct', function (instance, initial) {
			instance._uri = uri + initial.id;
			instance._subscription = function (msg) {
				fn(instance, msg);
			};
			// FIXME: this might not be the cleanest way to do it
			instance.publish = function (msg) {
				Adapter.channel.publish(instance._uri, msg);
			};
			Adapter.channel.subscribe(instance._uri, instance._subscription);
		});
	};
}
