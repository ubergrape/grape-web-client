/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

module.exports = userPreferences();

function userPreferences() {
	var pmListHeight = 'pmListHeight';
	return {
		setPmListHeight : function(value) {
			localStorage.setItem(pmListHeight, value);
		},
		getPmListHeight : function() {
			return localStorage.getItem(pmListHeight);
		}
	}
}