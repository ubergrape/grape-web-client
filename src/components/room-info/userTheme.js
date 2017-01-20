import color from 'color'
import {small} from 'grape-theme/dist/fonts'
import {blue, grayBlueDark} from 'grape-theme/dist/base-colors'

import buttonIcon from '../button/icon'

const hoverColor = color(blue).lighten(0.05).rgbaString()

export const styles = {
  row: {
    display: 'flex',
    marginBottom: 10,
    cursor: 'pointer',
    '&:hover button': {
      display: 'block'
    }
  },
  userName: {
    flex: 1
  },
  buttonKick: {
    extend: [
      buttonIcon('close', {color: grayBlueDark, hoverColor, iconOnly: true}),
      small
    ],
    flexShrink: 0,
    display: 'none'
  }
}
