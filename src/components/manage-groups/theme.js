import {grayBlue} from 'grape-theme/dist/base-colors'
import {normal} from 'grape-theme/dist/fonts'

import buttonPrimary from '../button/primary'

export const styles = {
  container: {
    extend: normal,
    height: 356,
    padding: [10, 0],
    overflowY: 'auto'
  },
  message: {
    extend: normal,
    color: grayBlue,
    padding: [0, 20, 10]
  },
  create: {
    extend: buttonPrimary
  },
  header: {
    display: 'flex'
  },
  title: {
    flex: 1
  }
}
