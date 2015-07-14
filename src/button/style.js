import colors from 'grape-theme/base-colors'
import fonts from 'grape-theme/fonts'
import sizes from 'grape-theme/sizes'

export default {
  button: {
    extend: fonts.normal,
    borderRadius: sizes.borderRadius.small,
    background: colors.grapeDark,
    border: 'none',
    color: colors.white,
    padding: '5px 10px',
    cursor: 'pointer',
    outline: 'none'
  }
}
