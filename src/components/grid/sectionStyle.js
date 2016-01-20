import colors from 'grape-theme/dist/base-colors'
import fonts from 'grape-theme/dist/fonts'
import utils from 'grape-jss-utils'

export default {
  header: {
    ...fonts.smaller,
    ...utils.ellipsis,
    lineHeight: '1em',
    background: colors.grayBlueLighter,
    padding: '5px 12px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: colors.gainsboroDark
  }
}
