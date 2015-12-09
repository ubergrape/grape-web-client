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
  channelInfo: {
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
    ...buttonIcon('invite', {color: '#aaa', hoverColor: '#318FEF'})
  },
  buttonLeave: {
    ...button,
    // XXX
    ...buttonIcon('exit', {color: '#aaa', hoverColor: '#318FEF'})
  },
  buttonKick: {
    // XXX
    ...buttonIcon('close', {color: '#707782', hoverColor: '#318FEF', iconOnly: true}),
    flexShrink: 0,
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
    ...fonts.big,
    flex: 1,
    alignSelf: 'center',
    color: '#707782'
  }
}
