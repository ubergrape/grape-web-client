import color from 'color'
import {blue, grayBlueLight, grayBlue, grayBlueDark} from 'grape-theme/dist/base-colors'
import {small, normal, big} from 'grape-theme/dist/fonts'

import linkButton from '../../button/link'
import buttonIcon from '../../button/icon'
import {spacing} from '../constants'

const divider = {
  marginBottom: spacing,
  paddingBottom: spacing,
  borderBottom: [1, 'solid', grayBlueLight]
}

const createIcon = name => buttonIcon(name, {
  color: blue,
  hoverColor: color(blue).lighten(0.05).rgbaString()
})

const button = {
  extend: linkButton,
  marginBottom: spacing / 2
}

export const styles = {
  userNameContainer: {
    extend: divider,
    display: 'flex',
    padding: spacing
  },
  details: {
    padding: spacing
  },
  name: big,
  about: {
    extend: [normal, divider],
    marginBottom: spacing,
    maxHeight: 200,
    overflowY: 'auto',
    color: grayBlueDark
  },
  whatIDo: {
    extend: small,
    textTransform: 'uppercase',
    background: '0 0 no-repeat',
    color: grayBlue
  },
  email: {
    extend: [
      createIcon('envelope'),
      button
    ]
  },
  skype: {
    extend: [
      createIcon('skype'),
      button
    ]
  },
  phone: {
    extend: [
      createIcon('phone'),
      button
    ]
  }
}
