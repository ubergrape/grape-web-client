import { red, white } from 'grape-theme/dist/base-colors'
import color from 'color'

import button from './default'

const stateColor = color(red)
  .lighten(0.2)
  .rgbaString()

export default {
  extend: button,
  background: red,
  color: white,
  borderColor: red,
  '&:hover, &:focus': {
    isolate: false,
    background: stateColor,
    borderColor: stateColor,
  },
}
