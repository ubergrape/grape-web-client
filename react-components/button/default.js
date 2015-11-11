import color from 'color'

import colors from 'grape-theme/dist/base-colors'
import webColors from 'grape-theme/dist/web-colors'
import fonts from 'grape-theme/dist/fonts'
import sizes from 'grape-theme/dist/sizes'

export default {
  ...fonts.normal,
  // XXX
  background: webColors.sidebarButtonBackground,
  color: colors.white,
  border: 'none',
  borderRadius: sizes.borderRadius.big,
  padding: '4px 16px 4px 14px',
  transition: 'background 0.3s, color 0.3s, font-size 0.3s',
  '&:hover': {
    // XXX
    background: color(webColors.sidebarButtonBackground).lighten(0.05).rgbaString()
  }
}
