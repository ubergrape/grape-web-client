import colors from 'grape-theme/dist/base-colors'
import fonts from 'grape-theme/dist/fonts'

export default {
  header: {
    ...fonts.smaller,
    background: colors.silverLight,
    borderBottom: '1px solid ' + colors.silverDark,
    padding: '5px 12px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: colors.gainsboroDark
  }
}
