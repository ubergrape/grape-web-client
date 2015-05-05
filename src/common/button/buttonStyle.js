import colors from 'grape-theme/base-colors'
import fonts from 'grape-theme/fonts'

export default {
  button: {
    extend: fonts.normal,
    borderRadius: 3,
    background: colors.grapeDark,
    border: 'none',
    color: colors.white,
    padding: '5px 10px',
    cursor: 'pointer',
    outline: 'none'
  }
}
