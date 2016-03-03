import color from 'color'
import utils from 'grape-jss-utils'
import fonts from 'grape-theme/dist/fonts'
import colors from 'grape-theme/dist/base-colors'
import webColors from 'grape-theme/dist/web-colors'

import linkButton from '../button/link'
import buttonIcon from '../button/icon'

const marginBottom = 15
const paddingBottom = 15

const button = {
  ...linkButton,
  ...fonts.normal,
  display: 'block',
  marginBottom: marginBottom / 2,
  '&:hover': {
    color: color(colors.blue).lighten(0.05).rgbaString(),
    textDecoration: 'underline !important'
  }
}

const divider = {
  marginBottom,
  paddingBottom,
  borderBottom: `1px solid ${colors.grayBlueLight}`
}

export default {
  channelInfo: {
    color: colors.grayBlueDark
  },
  header: {
    marginBottom,
    borderBottom: webColors.borderDefault
  },
  stats: {
    ...fonts.normal,
    ...divider,
    marginBottom,
  },
  description: {
    ...divider
  },
  descriptionText: {
    ...fonts.normal
  },
  actions: {
    ...divider,
    marginBottom,
    '& :last-child': {
      marginBottom: 0
    }
  },
  buttonInvite: {
    ...button,
    ...buttonIcon('invite', {color: colors.blue, hoverColor: color(colors.blue).lighten(0.05).rgbaString()})
  },
  buttonLeave: {
    ...button,
    color: '#707782',
    ...buttonIcon('exit', {color: colors.grayBlueDark, hoverColor: color(colors.blue).lighten(0.05).rgbaString()})
  },
  buttonKick: {
    ...buttonIcon('close', {color: colors.grayBlueDark, hoverColor: color(colors.blue).lighten(0.05).rgbaString(), iconOnly: true}),
    flexShrink: 0,
    display: 'none'
  },
  row: {
    display: 'flex',
    marginBottom: 10,
    cursor: 'pointer',
    '&:hover button': {
      display: 'block'
    }
  },
  avatar: {
    borderRadius: '50%',
    flexShrink: 0,
    width: 32,
    height: 32,
    marginRight: 10
  },
  name: {
    ...utils.ellipsis,
    ...fonts.normal,
    flex: 1,
    alignSelf: 'center',
    color: colors.grayBlueDark,
    '&:hover': {
      color: color(colors.blue).lighten(0.05).rgbaString()
    }
  }
}
