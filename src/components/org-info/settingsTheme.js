import {blue} from 'grape-theme/dist/base-colors'
import color from 'color'

import buttonReset from '../button/reset'

export const styles = {
  settings: {
    position: 'relative',
    flex: 1
  },
  settingsButton: {
    extend: buttonReset,
    cursor: 'pointer',
    maxWidth: '100%'
  },
  settingsButtonIcon: {
    isolate: false,
    fill: blue,
    '&:hover': {
      isolate: false,
      fill: color(blue).lighten(0.2).rgbaString()
    }
  }
}
