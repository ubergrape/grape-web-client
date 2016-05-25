import link from '../button/link'
import colors from 'grape-theme/dist/base-colors'
import fonts from 'grape-theme/dist/fonts'

export default {
  wrapper: {
    padding: 15,
    borderTop: `3px solid ${colors.grayBlueLighter}`
  },
  list: {
    minHeight: 80,
    maxHeight: '25vh'
  },
  orgInvite: {
    marginTop: 5,
    textAlign: 'right'
  },
  orgInviteButton: {
    ...link,
    ...fonts.small
  },
  user: {
    padding: '4px 8px',
    borderRadius: 3,
    cursor: 'pointer'
  },
  focusedUser: {
    backgroundColor: colors.grayBlueLighter
  },
  note: {
    paddingLeft: 10
  }
}
