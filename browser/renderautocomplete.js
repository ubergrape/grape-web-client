/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var isWebkit = require('./iswebkit');

module.exports = renderAutocompleteItem;

function renderAutocompleteItem(obj, asButton) {
	asButton = asButton || false;

	if (asButton===true) {
		if (isWebkit()) {
			// Google Chrome and other webkit browser
			// Can only draw an inline icon within the <button> element.
			return '<button class="ac" contenteditable="false" tabindex="-1" data-object="' + obj.id + '" data-url="' + obj.url+ '"><span class="entry-type-icon type-' + obj.service + obj.type +'">&nbsp;</span>' + obj.insert + '</button>';
		} else {
			// Firefox, IE
			return '<input type="button" class="ac service-' + obj.service + ' type-' + obj.service + obj.type +'" tabindex="-1" data-object="' + obj.id + '" data-url="' + obj.url+ '" value="' + obj.insert + '"/>';
		}
	} else {
		var target = ' target="_blank"';
		if (obj.service==="chatgrape") {
			target = '';
		}
		return '<a class="ac service-' + obj.service + ' type-' + obj.service + obj.type +'" tabindex="-1" data-object="' + obj.id + '" href="' + obj.url+ '"' + target + '>' + obj.insert + '</a>';
	}
}
