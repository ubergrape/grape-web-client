import buttonIcon from '../button/icon'

export default {
  navigation: {
    // display: 'none',
    position: 'absolute',
    left: 0,
    top: 56,
    right: 0,
    bottom: 0,
    overflowY: 'auto',
    zIndex: 1,
    background: '#ebeef3'
  },
  contacts: {
    ...buttonIcon('user', {color: '#000', hoverColor: '#f00'})
  },
  groups: {
    ...buttonIcon('users', {color: '#000', hoverColor: '#f00'})
  }
}
