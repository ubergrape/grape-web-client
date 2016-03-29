import reset from './reset'
import color from 'color'
import colors from 'grape-theme/dist/base-colors'
import fonts from 'grape-theme/dist/fonts'

export default {
  ...fonts.normal,
  ...reset,
  color: colors.blue,
  '&:hover': {
    color: color(colors.blue).lighten(0.05).rgbaString(),
    // !important can be removed when this is done:
    // https://github.com/jsstyles/jss/issues/119
    textDecoration: 'none !important'
  }
}
