import color from 'color'

import defaultButton from '../button/default'
import fonts from 'grape-theme/dist/fonts'
import webColors from 'grape-theme/dist/web-colors'

export default {
  layout: {
    display: 'flex',
    alignItems: 'baseline'
  },
  main: {
    flexGrow: 1,
    fontWeight: 'bold'
  },
  secondary: {
    margin: '0 10px'
  },
  buttonLink: {
    display: 'inline',
    padding: 0,
    border: 'none',
    outline: 'none',
    color: 'inherit',
    opacity: 0.8,
    textAlign: 'left',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  actionButton: {
    ...defaultButton,
    ...fonts.small,
    whiteSpace: 'nowrap',
    '&:hover': {
      background: color(webColors.alertInfo).lighten(0.8).hexString()
    }
  },
  info: {
    color: color(webColors.alertInfo).darken(0.3).hexString(),
    background: color(webColors.alertInfo).lighten(0.7).hexString()
  }
}
