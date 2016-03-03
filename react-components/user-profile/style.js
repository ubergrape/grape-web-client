import color from 'color'
import utils from 'grape-jss-utils'
import fonts from 'grape-theme/dist/fonts'
import colors from 'grape-theme/dist/base-colors'
import webColors from 'grape-theme/dist/web-colors'

import linkButton from '../button/link'
import buttonIcon from '../button/icon'

const marginBottom = 20
const paddingBottom = 20

const button = {
  ...linkButton,
  ...fonts.normal,
  display: 'block',
  marginBottom: marginBottom / 2
}

const divider = {
  marginBottom,
  paddingBottom,
  borderBottom: `1px solid ${colors.grayBlueLight}`
}

export default {
  profile: {
    ...divider,
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
  about: {
    ...divider,
    marginBottom,
    maxHeight: 200,
    overflowY: 'auto'
  },
  actions: {
    ...divider,
    '& :last-child': {
      marginBottom: 0
    }
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
