import color from 'color'
import colors from 'grape-theme/dist/base-colors'

import buttonIcon from '../button/icon'

const icon = {
  fontSize: 18
}

export const styles = {
  favorite: {
    ...buttonIcon('star', {color: colors.grayBlue, hoverColor: colors.grayBlueDark, iconOnly: true}),
    ...icon
  },
  favorited: {
    ...buttonIcon('star', {color: colors.orange, hoverColor: color(colors.orange).lighten(0.2).hexString(), iconOnly: true}),
    ...icon
  }
}
