import color from 'color'
import {small, normal} from 'grape-theme/dist/fonts'
import {blue, grayBlueDark} from 'grape-theme/dist/base-colors'

import buttonIcon from '../button/icon'

const hoverColor = color(blue).lighten(0.05).rgbaString()

export const styles = {
  row: {
    display: 'flex',
    marginBottom: 10,
    cursor: 'pointer',
    '&:hover button': {
      visibility: 'visible'
    }
  },
  userNameContainer: {
    flex: 1,
    overflow: 'hidden'
  },
  name: normal,
  buttonKick: {
    extend: [
      buttonIcon('close', {color: grayBlueDark, hoverColor, iconOnly: true}),
      small
    ],
    flexShrink: 0,
    visibility: 'hidden',
    marginLeft: 10
  }
}
