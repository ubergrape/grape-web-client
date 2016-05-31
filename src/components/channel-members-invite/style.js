import button from '../button/default'
import buttonPrimary from '../button/primary'
import buttonIcon from '../button/icon'
import colors from 'grape-theme/dist/base-colors'

const {padding} = button

export default {
  submit: {
    marginTop: 20,
    textAlign: 'right'
  },
  buttonInvite: {
    ...buttonPrimary,
    ...buttonIcon('invite', {color: colors.white}),
    padding,
    '&:disabled': {
      opacity: 0.5,
      pointerEvents: 'none'
    }
  }
}
