import color from 'color'
import colors from 'grape-theme/dist/base-colors'
import { normal } from 'grape-theme/dist/fonts'

import reset from './reset'

export default {
  extend: [normal, reset],
  color: colors.blue,
  cursor: 'pointer',
  textDecoration: 'none',
  '&:hover': {
    isolate: false,
    color: color(colors.blue)
      .lighten(0.2)
      .rgbaString(),
    textDecoration: 'none',
  },
}
