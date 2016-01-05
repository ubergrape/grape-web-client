import color from 'color'

import fonts from 'grape-theme/dist/fonts'
import webColors from 'grape-theme/dist/web-colors'

export default {
  alerts: {
    ...fonts.small,
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    zIndex: 100
  },
  alert: {
    padding: '10px 10px 10px 20px',
    borderBottom: '1px solid',
    opacity: 1,
    transform: 'scaleX(1) translate3d(0, 0, 0)',
    animation: 'hifromthetopNoShadow 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  },
  info: {
    color: color(webColors.alertInfo).darken(0.3).hexString(),
    background: color(webColors.alertInfo).lighten(0.6).hexString(),
    borderColor: color(webColors.alertInfo).lighten(0.5).hexString()
  },
  success: {
    color: color(webColors.alertSuccess).lighten(0.2).hexString(),
    background: color(webColors.alertSuccess).lighten(1.1).hexString(),
    borderColor: color(webColors.alertSuccess).lighten(1).hexString()
  },
  warning: {
    color: color(webColors.alertWarning).lighten(0.1).hexString(),
    background: color(webColors.alertWarning).lighten(0.65).hexString(),
    borderColor: color(webColors.alertWarning).lighten(0.55).hexString()
  },
  danger: {
    color: color(webColors.alertDanger).lighten(0.1).hexString(),
    background: color(webColors.alertDanger).lighten(0.65).hexString(),
    borderColor: color(webColors.alertDanger).lighten(0.55).hexString()
  }
}
