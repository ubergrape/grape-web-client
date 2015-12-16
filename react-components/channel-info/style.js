import utils from 'grape-jss-utils'
import fonts from 'grape-theme/dist/fonts'

import linkButton from '../button/link'
import buttonIcon from '../button/icon'

const marginBottom = 20

const button = {
  ...linkButton,
  ...fonts.normal,
  display: 'block',
  marginBottom: marginBottom / 2,
  // XXX
  '&:hover': {
    color: '#4098f2 !important',
    textDecoration: 'underline !important'
  }
}

export default {
  channelInfo: {
    // XXX
    color: '#707782'
  },
  header: {
    marginBottom,
    // XXX
    borderBottom: '1px solid #D3D5DA'
  },
  stats: {
    ...fonts.normal,
    marginBottom
  },
  description: {
    marginBottom
  },
  descriptionText: {
    ...fonts.normal
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
    ...buttonIcon('invite', {color: '#1e86f0', hoverColor: '#4098f2'})
  },
  buttonLeave: {
    ...button,
    // XXX
    color: '#707782',
    ...buttonIcon('exit', {color: '#707782', hoverColor: '#4098f2'})
  },
  buttonKick: {
    // XXX
    ...buttonIcon('close', {color: '#707782', hoverColor: '#4098f2', iconOnly: true}),
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
    width: 32,
    height: 32,
    marginRight: 10
  },
  name: {
    ...utils.ellipsis,
    ...fonts.normal,
    flex: 1,
    alignSelf: 'center',
    // XXX
    color: '#707782',
    '&:hover': {
      color: '#4098f2 !important'
    }
  }
}
