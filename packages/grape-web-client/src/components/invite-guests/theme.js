import { small } from 'grape-theme/dist/fonts'
import { grayBlueLighter } from 'grape-theme/dist/base-colors'

import link from '../button/link'

export const styles = {
  link: {
    extend: [link, small],
  },
  linkWrapper: {
    display: 'block',
    borderTop: [3, 'solid', grayBlueLighter],
    padding: [5, 0, 5, 20],
    '&:first-child': {
      isolate: false,
      paddingTop: 10,
    },
    '&:last-child': {
      isolate: false,
      paddingBottom: 10,
    },
  },
}
