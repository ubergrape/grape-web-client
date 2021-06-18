import {
  buttonBgPrimary,
  buttonColorPrimary,
} from 'grape-theme/dist/web-colors'
import color from 'color'

import button from './default'

const stateColor = color(buttonBgPrimary)
  .lighten(0.2)
  .rgbaString()

export default {
  ...button,
  background: buttonBgPrimary,
  color: buttonColorPrimary,
  borderColor: buttonBgPrimary,
  '&:hover, &:focus': {
    isolate: false,
    background: stateColor,
    borderColor: stateColor,
  },
}
