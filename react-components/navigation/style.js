import buttonIcon from '../button/icon'
import baseColors from 'grape-theme/dist/base-colors'

export default {
  navigation: {
    position: 'absolute',
    left: 0,
    top: 56,
    right: 0,
    bottom: 0,
    overflowY: 'auto',
    background: baseColors.grayBlueLighter
  },
  contacts: {
    ...buttonIcon('user', {color: '#000', hoverColor: '#f00'})
  },
  groups: {
    ...buttonIcon('users', {color: '#000', hoverColor: '#f00'})
  }
}
