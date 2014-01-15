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
			Adapter.channel.unsubscribe(uri + this.id, this._subscription);
		};
		Model.on('construct', function (instance, initial) {
			instance._subscription = function (msg) {
				fn(instance, msg);
			};
			Adapter.channel.subscribe(uri + initial.id, instance._subscription);
		});
	};
}
