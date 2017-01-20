import color from 'color'
import colors from 'grape-theme/dist/base-colors'

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

export const styles = {
  userName: {
    extend: divider,
    display: 'flex'
  },
  about: {
    extend: divider,
    marginBottom,
    maxHeight: 200,
    overflowY: 'auto'
  },
  email: createIcon('envelope'),
  skype: createIcon('skype'),
  phone: createIcon('phone')
}
