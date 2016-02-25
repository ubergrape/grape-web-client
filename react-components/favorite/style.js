import buttonIcon from '../button/icon'
import color from 'color'
import colors from 'grape-theme/dist/base-colors'

const icon = {
  fontSize: 18,
  height: 18,
  display: 'block',
  marginRight: 5
}

export default {
  favorite: {
    ...buttonIcon('star', {color: colors.grayBlue, hoverColor: colors.grayBlueDark, iconOnly: true}),
    ...icon
  },
  favorited: {
    ...buttonIcon('star', {color: colors.orange, hoverColor: color(colors.orange).lighten(0.2).hexString(), iconOnly: true}),
    ...icon
  }
}
