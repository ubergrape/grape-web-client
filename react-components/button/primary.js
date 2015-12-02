import webColors from 'grape-theme/dist/web-colors'
import color from 'color'

import button from './style'

export default {
  ...button,
  background: webColors.buttonBgPrimary,
  color: webColors.buttonColorPrimary,
  '&:hover': {
    background: color(webColors.buttonBgPrimary).lighten(0.2).rgbaString()
  }
}
