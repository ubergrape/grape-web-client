import color from 'color'
import colors from 'grape-theme/dist/base-colors'
import {big} from 'grape-theme/dist/fonts'

import linkButton from '../button/link'
import buttonIcon from '../button/icon'

const marginBottom = 20
const paddingBottom = 20

const divider = {
  marginBottom,
  paddingBottom,
  borderBottom: `1px solid ${colors.grayBlueLight}`
}

const createIcon = (name) => buttonIcon(name, {
  color: colors.blue,
  hoverColor: color(colors.blue).lighten(0.05).rgbaString()
})

const button = {
  extend: linkButton,
  marginBottom: marginBottom / 2
}

export const styles = {
  userNameContainer: {
    extend: divider,
    display: 'flex'
  },
  name: big,
  about: {
    extend: divider,
    marginBottom,
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
