import fonts from 'grape-theme/dist/fonts'
import colors from 'grape-theme/dist/base-colors'

import { plusIconStyle } from '../constants'

export default {
  info: {
    extend: fonts.normal,
    padding: 15,
    color: colors.gray,
    background: colors.grayBlueLighter,
  },
  plusIcon: {
    extend: plusIconStyle,
    width: '1.1em',
    height: '1.1em',
  },
}
