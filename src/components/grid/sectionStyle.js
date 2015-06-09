import colors from 'grape-theme/base-colors'
import fonts from 'grape-theme/fonts'

export default {
  header: {
    extend: fonts.small,
    background: colors.silverLight,
    borderBottom: '1px solid ' + colors.silverDark,
    padding: '5px 12px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: colors.gainsboroDark
  }
}
