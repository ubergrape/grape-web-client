'use strict';

exports.__esModule = true;
exports['default'] = {
  modal: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
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
    margin: '0 10%'
  }
};
module.exports = exports['default'];