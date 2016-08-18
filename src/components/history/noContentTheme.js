import color from 'color'
import {biggest, normal} from 'grape-theme/dist/fonts'
import {blue} from 'grape-theme/dist/base-colors'
import staticUrl from 'staticurl'

import linkButton from '../button/link'
import buttonIcon from '../button/icon'

const hoverColor = color(blue).lighten(0.05).rgbaString()

const button = {
  extend: [linkButton, normal],
  display: 'block',
  '&:hover': {
    color: hoverColor,
    textDecoration: 'underline !important'
  }
}

const buttonIconOptions = {
  color: blue,
  hoverColor,
  size: normal.fontSize
}

const image = {
  width: 100,
  height: 100,
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat'
}

export const styles = {
  noContent: {
    display: 'flex',
    padding: '80px 20px'
  },
  illustration: {
    paddingRight: 20
  },
  publicChannelImage: {
    extend: image,
    backgroundImage: `url(${staticUrl('/images/head.png')})`
  },
  privateChannelImage: {
    extend: image,
    backgroundImage: `url(${staticUrl('/images/mascot_lock_closed.png')})`
  },
  pmChannelImage: {
    extend: image,
    backgroundImage: `url(${staticUrl('/images/head_lock.png')})`
  },
  description: {
    minWidth: 300
  },
  title: biggest,
  text: normal,
  buttonInvite: {
    extend: [
      button,
      buttonIcon('invite', buttonIconOptions)
    ],
    padding: '20px 20px 0 0'
  },
  buttonIntegration: {
    extend: [
      button,
      buttonIcon('iconLink', buttonIconOptions)
    ],
    paddingTop: 20
  }
}
