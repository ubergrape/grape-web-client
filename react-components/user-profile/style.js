import color from 'color'
import colors from 'grape-theme/dist/base-colors'
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
    ...buttonIcon('envelope', {color: colors.blue, hoverColor: color(colors.blue).lighten(0.05).rgbaString()})
  },
  skype: {
    ...button,
    ...buttonIcon('skype', {color: colors.blue, hoverColor: color(colors.blue).lighten(0.05).rgbaString()})
  },
  phone: {
    ...button,
    ...buttonIcon('phone', {color: colors.blue, hoverColor: color(colors.blue).lighten(0.05).rgbaString()})
  }
}
