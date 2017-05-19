import {blue} from 'grape-theme/dist/base-colors'
import color from 'color'

import buttonReset from '../button/reset'
import {iconSize} from '../header'

export const styles = {
  settings: {
    position: 'relative',
    flexShrink: 0
  },
  settingsButton: {
    extend: buttonReset,
    cursor: 'pointer',
    display: 'flex'
  },
  settingsButtonIcon: {
    isolate: false,
    fill: blue,
    width: iconSize,
    height: iconSize,
    '&:hover': {
      isolate: false,
      fill: color(blue).lighten(0.2).rgbaString()
    }
  }
}
