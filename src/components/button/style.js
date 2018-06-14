import colors from 'grape-theme/dist/base-colors'
import fonts from 'grape-theme/dist/fonts'
import sizes from 'grape-theme/dist/sizes'

export default {
  button: {
    ...fonts.normal,
    borderRadius: sizes.borderRadius.small,
    background: colors.grayDark,
    border: 'none',
    color: colors.white,
    padding: '5px 10px',
    cursor: 'pointer',
    outline: 'none',
  },
}
