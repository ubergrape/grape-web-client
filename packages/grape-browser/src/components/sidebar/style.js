import colors from 'grape-theme/dist/base-colors'
import fonts from 'grape-theme/dist/fonts'

export default {
  sidebar: {
    ...fonts.normal,
    color: colors.grayDark,
    borderLeft: `1px solid ${colors.silverDark}`,
    backgroundColor: colors.white,
    position: 'relative',
  },
}
