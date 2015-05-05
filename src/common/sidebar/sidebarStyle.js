import colors from 'grape-theme/base-colors'
import fonts from 'grape-theme/fonts'

export default {
  sidebar: {
    extend: fonts.normal,
    height: '100%',
    boxShadow: 'inset 0px 0px 3px 3px rgba(0,0,0,0.10)',
    color: colors.grapeTypo,
    borderLeft: '3px solid ' + colors.grapeLight
  }
}
