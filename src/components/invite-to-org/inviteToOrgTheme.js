import {grayBlueLighter, grayBlueDark} from 'grape-theme/dist/base-colors'
import {normal, small} from 'grape-theme/dist/fonts'
import buttonPrimary from '../button/primary'

import {horizontalPadding} from '../input/theme/grayBigger'

export const styles = {
  wrapper: {
    padding: 15,
    borderTop: `3px solid ${grayBlueLighter}`
  },
  form: {
    position: 'relative'
  },
  label: {
    ...normal,
    marginLeft: horizontalPadding
  },
  line: {
    marginTop: 10
  },
  textarea: {
    display: 'block',
    height: '5em'
  },
  note: {
    ...small,
    color: grayBlueDark,
    paddingLeft: horizontalPadding,
    marginTop: 5,
    opacity: 0,
    willChange: 'opacity',
    transition: 'opacity 0.3s ease-out'
  },
  noteVisible: {
    opacity: 1
  },
  submit: {
    marginTop: 15,
    textAlign: 'right'
  },
  submitButton: {
    ...buttonPrimary,
    '&:disabled': {
      isolate: false,
      opacity: 0.5,
      pointerEvents: 'none'
    }
  },
  inviteLink: {
    marginTop: 20,
    paddingTop: 10,
    borderTop: `1px solid ${grayBlueLighter}`
  },
  success: {
    ...small,
    marginTop: 5,
    paddingLeft: horizontalPadding,
    color: grayBlueDark
  }
}
