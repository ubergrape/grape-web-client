import fonts from 'grape-theme/dist/fonts'
import utils from 'grape-jss-utils'

import linkButton from '../button/link'
import buttonIcon from '../button/icon'

const marginBottom = 20

const button = {
  ...linkButton,
  ...fonts.normal,
  display: 'block',
  marginBottom: marginBottom / 2
}

export default {
  profile: {
    display: 'flex'
  },
  leftColumn: {
    flexShrink: 0,
    width: 60,
    paddingRight: 20
  },
  rightColumn: {
    flex: 1
  },
  avatar: {
    borderRadius: '50%',
    width: '100%'
  },
  fullName: {
    ...fonts.big,
    ...utils.ellipsis
  },
  username: {
    ...utils.ellipsis,
    marginBottom
  },
  about: {
    marginBottom,
    maxHeight: 200,
    overflowY: 'auto'
  },
  email: {
    ...button,
    // XXX
    ...buttonIcon('envelope', {color: '#707782', hoverColor: '#318FEF'})
  },
  skype: {
    ...button,
    // XXX
    ...buttonIcon('skype', {color: '#707782', hoverColor: '#318FEF'})
  },
  phone: {
    ...button,
    // XXX
    ...buttonIcon('phone', {color: '#707782', hoverColor: '#318FEF'})
  }
}
