import {red, white} from 'grape-theme/dist/base-colors'
import color from 'color'

import button from './default'

export default {
  ...button,
  background: red,
  color: white,
  '&:hover, &:focus': {
    isolate: false,
    background: color(red).lighten(0.2).rgbaString()
  }
}
