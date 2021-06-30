import color from 'color'
import { biggest, normal } from 'grape-theme/dist/fonts'
import { blue } from 'grape-theme/dist/base-colors'

import staticUrl from '../../../utils/static-url'
import linkButton from '../../button/link'
import buttonIcon from '../../button/icon'

const hoverColor = color(blue)
  .lighten(0.05)
  .rgbaString()

const button = {
  extend: [linkButton, normal],
  display: 'block',
  '&:hover': {
    isolate: false,
    color: hoverColor,
    textDecoration: 'underline !important',
  },
}

const buttonIconOptions = {
  color: blue,
  hoverColor,
  size: normal.fontSize,
}

const image = {
  width: 100,
  height: 100,
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
}

const styles = {
  noContent: {
    display: 'flex',
    padding: [80, 20],
  },
  illustration: {
    flexShrink: 0,
    paddingRight: 20,
  },
  publicChannelImage: {
    extend: image,
    backgroundImage: `url(${staticUrl('/images/head.png')})`,
  },
  privateChannelImage: {
    extend: image,
    backgroundImage: `url(${staticUrl('/images/mascot_lock_closed.png')})`,
  },
  pmChannelImage: {
    extend: image,
    backgroundImage: `url(${staticUrl('/images/head_lock.png')})`,
  },
  description: {
    minWidth: 300,
  },
  title: {
    extend: biggest,
    display: 'block',
  },
  text: {
    extend: normal,
    display: 'block',
  },
  buttonInvite: {
    extend: [button, buttonIcon('invite', buttonIconOptions)],
    padding: [20, 20, 0, 0],
  },
  buttonIntegration: {
    extend: [button, buttonIcon('iconLink', buttonIconOptions)],
    paddingTop: 20,
  },
}

export default styles
