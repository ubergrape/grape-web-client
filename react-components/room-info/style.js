import colors from 'grape-theme/dist/base-colors'
import utils from 'grape-jss-utils'
import fonts from 'grape-theme/dist/fonts'

import linkButton from '../button/link'
import buttonIcon from '../button/icon'

const marginBottom = 20

const button = {
  ...linkButton,
  ...fonts.big,
  marginBottom: marginBottom / 2
}

export default {
  roomInfo: {
    color: '#707782'
  },
  header: {
    marginBottom,
    borderBottom: '1px solid #D3D5DA'
  },
  stats: {
    ...fonts.big,
    marginBottom
  },
  description: {
    marginBottom
  },
  descriptionText: {
    ...fonts.big
  },
  actions: {
    marginBottom,
    '& :last-child': {
      marginBottom: 0
    }
  },
  buttonInvite: {
    ...button,
    // XXX
    ...buttonIcon('link', {hoverColor: colors.aquaLight})
  },
  buttonLeave: {
    ...button,
    // XXX
    ...buttonIcon('link', {hoverColor: colors.aquaLight})
  },
  buttonKick: {
    // XXX
    ...buttonIcon('link', {hoverColor: colors.aquaLight, iconOnly: true}),
    flexShrink: 0,
    height: '100%',
    width: 20,
    display: 'none'
  },
  row: {
    display: 'flex',
    marginBottom: 10,
    cursor: 'pointer',
    '&:hover button': {
      display: 'block'
    }
  },
  avatar: {
    borderRadius: '50%',
    flexShrink: 0,
    width: 35,
    height: 35,
    marginRight: 10
  },
  name: {
    ...utils.ellipsis,
    flex: 1,
    alignSelf: 'center'
  }
}
