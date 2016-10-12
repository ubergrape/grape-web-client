import color from 'color'

import fonts from 'grape-theme/dist/fonts'
import webColors from 'grape-theme/dist/web-colors'
import defaultButton from '../button/default'
import inlineLink from '../button/inlineLink'

export default {
  actionButton: {
    ...defaultButton,
    ...fonts.small,
    whiteSpace: 'nowrap',
    '&:hover': {
      isolate: false,
      background: color(webColors.alertInfo).lighten(0.8).hexString()
    }
  },
  infoButton: {
    color: color(webColors.alertInfo).darken(0.3).hexString(),
    background: color(webColors.alertInfo).lighten(0.7).hexString()
  },
  dangerButton: {
    color: color(webColors.alertDanger).darken(0.3).hexString(),
    background: color(webColors.alertDanger).lighten(0.7).hexString()
  },
  buttonLink: {
    ...inlineLink,
    opacity: 0.8,
    '&:hover': {
      isolate: false,
      textDecoration: 'underline !important'
    }
  },
  layout: {
    display: 'flex',
    alignItems: 'baseline'
  },
  mainCol: {
    flexGrow: 1,
    fontWeight: 'bold'
  },
  secondaryCol: {
    flexShrink: 0,
    margin: '0 10px'
  }
}
