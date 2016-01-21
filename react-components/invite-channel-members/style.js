import button from '../button/default'
import buttonPrimary from '../button/primary'
import link from '../button/link'
import buttonIcon from '../button/icon'
import colors from 'grape-theme/dist/base-colors'
import color from 'color'
import fonts from 'grape-theme/dist/fonts'

const {padding} = button
const marginTop = {
  marginTop: 20
}
export default {
  wrapper: {
    padding: 15,
    borderTop: `3px solid ${colors.grayBlueLighter}`
  },
  list: {...marginTop},
  submit: {
    ...marginTop,
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
  },
  orgInvite: {
    marginTop: 5,
    textAlign: 'right'
  },
  orgInviteButton: {
    ...link,
    ...fonts.small
  },
  item: {
    padding: '4px 8px',
    borderRadius: 3,
    cursor: 'pointer'
  },
  focusedItem: {
    backgroundColor: colors.grayBlueLighter
  },
  note: {
    paddingLeft: 10
  }
}
