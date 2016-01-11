'use strict';

exports.__esModule = true;
exports.basic = basic;
exports.canAdd = canAdd;
exports.needsHelp = needsHelp;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function basic() {
  return {
    title: _react2['default'].createElement(
      'h2',
      null,
      'Write what you are looking for or use one of the filters on the left.'
    ),
    description: _react2['default'].createElement(
      'p',
      null,
      'You can write ',
      _react2['default'].createElement(
        'b',
        null,
        '"#filename"'
      ),
      ' for example or a type like ',
      _react2['default'].createElement(
        'b',
        null,
        '"#task"'
      ),
      '. If you want to browse a specific service, start typing the filter name like ',
      _react2['default'].createElement(
        'b',
        null,
        '"#filter"'
      ),
      ' for example.'
    ),
    ok: true
  };
}

function canAdd(data) {
  return {
    title: _react2['default'].createElement(
      'h2',
      null,
      'Time to connect some Deep Service Integrations!'
    ),
    description: _react2['default'].createElement(
      'p',
      null,
      data.orgName,
      ' needs a couple of integrations, for the best autocomplete experience.'
    ),
    ok: false
  };
}

function needsHelp(data) {
  var ret = canAdd(data);
  ret.description.props.children.push(_react2['default'].createElement(
    'p',
    null,
    'Ask a team member with proper permissions (like ',
    data.orgOwner,
    ') to add them!'
  ));
  return ret;
}