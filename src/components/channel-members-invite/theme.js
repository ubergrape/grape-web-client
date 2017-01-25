import {white} from 'grape-theme/dist/base-colors'

import buttonPrimary from '../button/primary'
import buttonIcon from '../button/icon'

export const styles = {
  submit: {
    marginTop: 20,
    textAlign: 'right'
  },
  buttonInvite: {
    extend: [
      buttonIcon('invite', {color: white}),
      buttonPrimary
    ],
    '&:disabled': {
      isolate: false,
      opacity: 0.5,
      pointerEvents: 'none'
    }
  }
}
