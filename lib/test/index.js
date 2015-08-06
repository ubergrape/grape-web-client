/**
 * Its a simplified version of `querySelector` where name is space separated
 * list names. Those names need to be defined in data-test attributes.
 *
 * E.g. $('input wrapper something')
 */
'use strict';

exports.__esModule = true;
exports.$ = $;

function $(names) {
  var selector = '';

  names.split(' ').forEach(function (name) {
    selector += '[data-test="' + name + '"] ';
  });

  return document.querySelector(selector);
}

afterEach(function () {
  document.body.innerHTML = '';
});