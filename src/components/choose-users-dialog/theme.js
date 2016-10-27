import {grayBlueLighter} from 'grape-theme/dist/base-colors'
import {small} from 'grape-theme/dist/fonts'

import link from '../button/link'

export const styles = {
  wrapper: {
    position: 'relative',
    padding: 15,
    borderTop: `3px solid ${grayBlueLighter}`
  },
  list: {
    minHeight: 100,
    maxHeight: '25vh'
  },
  orgInvite: {
    marginTop: 5,
    textAlign: 'right'
  },
  orgInviteButton: {
    extend: [link, small]
  },
  user: {
    padding: '4px 8px',
    borderRadius: 3,
    cursor: 'pointer'
  },
  focusedUser: {
    backgroundColor: grayBlueLighter
  },
  note: {
    margin: 10
  }
}
