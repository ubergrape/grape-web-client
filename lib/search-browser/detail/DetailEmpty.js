'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _grapeWebLibJss = require('grape-web/lib/jss');

var _detailEmptyStyle = require('./detailEmptyStyle');

var _detailEmptyStyle2 = _interopRequireDefault(_detailEmptyStyle);

/**
 * Empty detail view.
 */

var DetailEmpty = (function (_Component) {
  _inherits(DetailEmpty, _Component);

  function DetailEmpty() {
    _classCallCheck(this, _DetailEmpty);

    _Component.apply(this, arguments);
  }

  DetailEmpty.prototype.render = function render() {
    var classes = this.props.sheet.classes;

    return _react2['default'].createElement(
      'div',
      { className: classes.empty },
      _react2['default'].createElement('img', { src: this.props.images.noDetail }),
      _react2['default'].createElement(
        'span',
        { className: classes.note },
        'No Detail Infos for this Item'
      )
    );
  };

  _createClass(DetailEmpty, null, [{
    key: 'propTypes',
    value: {
      sheet: _react.PropTypes.object.isRequired,
      images: _react.PropTypes.object
    },
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {
      images: {}
    },
    enumerable: true
  }]);

  var _DetailEmpty = DetailEmpty;
  DetailEmpty = _grapeWebLibJss.useSheet(_detailEmptyStyle2['default'])(DetailEmpty) || DetailEmpty;
  return DetailEmpty;
})(_react.Component);

exports['default'] = DetailEmpty;
module.exports = exports['default'];