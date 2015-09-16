'use string';

var mapKeys = require('lodash/object/mapKeys');
var snakeCase = require('lodash/string/snakeCase');

/**
 * Converts all obj keys to snake case.
 */
exports.toSnake = function(obj) {
    return mapKeys(obj, function(val, key) {
        return snakeCase(key);
    });
};
