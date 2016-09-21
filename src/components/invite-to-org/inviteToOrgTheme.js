import {grayBlueLighter} from 'grape-theme/dist/base-colors'
import {normal} from 'grape-theme/dist/fonts'
import buttonPrimary from '../button/primary'

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
  textarea: {
    height: '5em'
  },
  submit: {
    marginTop: 15,
    textAlign: 'right'
  },
  submitButton: {
    ...buttonPrimary,
    '&:disabled': {
      opacity: 0.5,
      pointerEvents: 'none'
    }
  },
  inviteLink: {
    marginTop: 20,
    paddingTop: 10,
    borderTop: `1px solid ${grayBlueLighter}`
  },
  linkLayout: {
    display: 'flex'
  },
  linkInput: {
    flexGrow: 1,
    marginRight: 10
  },
  linkUpdate: {
    flexShrink: 0
  }
}
