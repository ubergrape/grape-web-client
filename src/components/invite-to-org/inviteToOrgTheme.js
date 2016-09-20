import {grayBlueLighter} from 'grape-theme/dist/base-colors'
import {normal} from 'grape-theme/dist/fonts'

import {horizontalPadding} from '../input/theme/grayBigger'

export const styles = {
  wrapper: {
    padding: 15,
    borderTop: `3px solid ${grayBlueLighter}`
  },
  label: {
    ...normal,
    marginLeft: horizontalPadding
  },
  line: {
    marginTop: 10
  },
  submit: {
    marginTop: 20
  }
}
