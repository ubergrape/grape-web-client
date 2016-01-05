'use strict';

exports.__esModule = true;
exports['default'] = {
  modal: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    zIndex: 1000,
    top: 0
  },
  backdrop: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 'auto',
    backgroundColor: '#000',
    opacity: 0.5
  },
  browser: {
    position: 'relative',
    margin: '10%',
    marginBottom: 0
  }
};
module.exports = exports['default'];