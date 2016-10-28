import colors from 'grape-theme/dist/base-colors'

import {padding} from '../button/default'
import buttonPrimary from '../button/primary'
import buttonIcon from '../button/icon'

export const styles = {
  submit: {
    marginTop: 20,
    textAlign: 'right'
  },
  buttonInvite: {
    extend: [
      buttonPrimary,
      buttonIcon('invite', {color: colors.white})
    ],
    padding,
    '&:disabled': {
      isolate: false,
      opacity: 0.5,
      pointerEvents: 'none'
    }
  }
}
