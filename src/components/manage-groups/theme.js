import { grayBlue } from 'grape-theme/dist/base-colors'
import fonts from 'grape-theme/dist/fonts'

import buttonPrimary from '../button/primary'

export const styles = {
  container: {
    extend: fonts.normal,
    display: 'block',
    height: 356,
    padding: [10, 0],
    overflowY: 'auto',
  },
  message: {
    extend: fonts.normal,
    color: grayBlue,
    padding: [0, 20, 10],
  },
  create: {
    extend: buttonPrimary,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    flex: 1,
  },
}
