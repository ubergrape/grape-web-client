import {
  buttonBgDefault,
  buttonColorPrimary,
} from 'grape-theme/dist/web-colors'
import color from 'color'

import button from './default'

const stateColor = color(buttonBgDefault)
  .lighten(0.2)
  .rgbaString()

export default {
  ...button,
  background: buttonBgDefault,
  color: buttonColorPrimary,
  borderColor: buttonBgDefault,
  '&:hover, &:focus': {
    isolate: false,
    background: stateColor,
    borderColor: stateColor,
  },
}
