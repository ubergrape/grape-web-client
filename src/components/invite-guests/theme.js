import { small } from 'grape-theme/dist/fonts'

import link from '../button/link'

export const styles = {
  link: {
    extend: [link, small],
  },
  linkWrapper: {
    display: 'block',
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
