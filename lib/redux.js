'use strict';

exports.__esModule = true;
exports.mapActionsToProps = mapActionsToProps;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _boundActions = require('./boundActions');

var _boundActions2 = _interopRequireDefault(_boundActions);

function mapActionsToProps(actionsNames) {
  var actionsPropsMap = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return function () {
    return actionsNames.reduce(function (selectedActions, actionName) {
      var action = _boundActions2['default'][actionName];
      if (action) selectedActions[actionsPropsMap[actionName] || actionName] = action;
      return selectedActions;
    }, {});
  };
}