import { grayBlueLighter } from 'grape-theme/dist/base-colors'
import { small } from 'grape-theme/dist/fonts'

import link from '../button/link'

export const styles = {
  wrapper: {
    display: 'block',
    position: 'relative',
    padding: 15,
    borderTop: [3, 'solid', grayBlueLighter],
    borderBottom: [3, 'solid', grayBlueLighter],
  },
  list: {
    display: 'block',
    height: 150,
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
  link: {
    extend: [link, small],
  },
  user: {
    display: 'block',
    padding: [4, 8],
    borderRadius: 3,
    '&, & *': {
      isolate: false,
      cursor: 'pointer',
    },
  },
  focusedUser: {
    backgroundColor: grayBlueLighter,
  },
  note: {
    composes: '$list',
    padding: 20,
  },
}
