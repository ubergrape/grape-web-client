'use strict';

exports.__esModule = true;
exports.getLabel = getLabel;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodashCollectionFind = require('lodash/collection/find');

var _lodashCollectionFind2 = _interopRequireDefault(_lodashCollectionFind);

var _lodashLangIsEmpty = require('lodash/lang/isEmpty');

var _lodashLangIsEmpty2 = _interopRequireDefault(_lodashLangIsEmpty);

/**
 * Find state meta.
 */

function getLabel(detail) {
  if (!detail || _lodashLangIsEmpty2['default'](detail.meta)) return '';
  var label = _lodashCollectionFind2['default'](detail.meta, function (meta) {
    return meta.label === 'State' || meta.label === 'Kind';
  });
  if (label) return label.value;
}