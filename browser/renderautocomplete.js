/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var isWebkit = require('./iswebkit');

module.exports = renderAutocompleteItem;

function renderAutocompleteItem(obj) {
    if (isWebkit()) {
        // Google Chrome and other webkit browser
        // Can only draw an inline icon within the <button> element.
        return '<button class="ac" contenteditable="false" tabindex="-1" data-object="' + obj.id + '">' + obj.insert + '<span class="entry-type-icon type-' + obj.service + obj.type +'">&nbsp;</span></button>';
    } else {
        // Firefox, IE
        return '<input type="button" class="ac service-' + obj.service + ' type-' + obj.service + obj.type +'" tabindex="-1" data-object="' + obj.id + '" value="' + obj.insert + '"/>';
    }
}
