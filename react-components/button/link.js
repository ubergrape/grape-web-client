import colors from 'grape-theme/dist/base-colors'
import fonts from 'grape-theme/dist/fonts'

export default {
  ...fonts.normal,
  border: 'none',
  margin: 0,
  padding: 0,
  // XXX
  color: '#aaa',
  '&:hover': {
    color: colors.aquaLight,
    // !important can be removed when this is done:
    // https://github.com/jsstyles/jss/issues/119
    textDecoration: 'none !important'
  }
}
