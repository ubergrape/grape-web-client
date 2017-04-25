import color from 'color'
import {blue, grayBlueLight} from 'grape-theme/dist/base-colors'
import {big} from 'grape-theme/dist/fonts'

import linkButton from '../../button/link'
import buttonIcon from '../../button/icon'
import {spacing} from '../sidebar-panel/theme'

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
    extend: divider,
    marginBottom: spacing,
    maxHeight: 200,
    overflowY: 'auto'
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
