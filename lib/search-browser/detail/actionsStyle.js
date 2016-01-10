'use strict';

exports.__esModule = true;
exports['default'] = {
  action: {
    display: 'flex',
    padding: '5px 15px',
    cursor: 'pointer',
    '&:hover': {
      // XXX
      background: 'red'
    }
  },
  actionFocused: {
    // XXX
    background: 'red'
  },
  // When parent component is not focused, but action is.
  actionFocusedBg: {
    // XXX
    background: 'rgba(218, 156, 156, 1)'
  },
  icon: {
    flexShrink: 0,
    width: 16,
    height: 16,
    marginRight: 10,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    alignSelf: 'center'
  },
  text: {
    flex: 1
  }
};
module.exports = exports['default'];