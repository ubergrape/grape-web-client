import color from 'color'
import fonts from 'grape-theme/dist/fonts'
import webColors from 'grape-theme/dist/web-colors'

import defaultButton from '../button/default'
import inlineLink from '../button/inlineLink'

const backgroundColors = {
  actionHover: color(webColors.alertInfo).lighten(0.8).hexString(),
  info: color(webColors.alertInfo).lighten(0.7).hexString(),
  danger: color(webColors.alertDanger).lighten(0.7).hexString()
}

export default {
  actionButton: {
    ...defaultButton,
    ...fonts.small,
    whiteSpace: 'nowrap',
    '&:hover': {
      isolate: false,
      background: backgroundColors.actionHover,
      borderColor: backgroundColors.actionHover
    }
  },
  infoButton: {
    color: color(webColors.alertInfo).darken(0.3).hexString(),
    background: backgroundColors.info,
    borderColor: backgroundColors.info
  },
  dangerButton: {
    color: color(webColors.alertDanger).darken(0.3).hexString(),
    background: backgroundColors.danger,
    borderColor: backgroundColors.danger
  },
  buttonLink: {
    ...inlineLink,
    opacity: 0.8,
    '&:hover': {
      isolate: false,
      textDecoration: 'underline'
    }
  },
  layout: {
    display: 'flex',
    alignItems: 'baseline'
  },
  mainCol: {
    flexGrow: 1
  },
  secondaryCol: {
    flexShrink: 0,
    margin: [0, 10]
  }}
