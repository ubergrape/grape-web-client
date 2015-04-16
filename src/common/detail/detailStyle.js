import colors from 'grape-theme/base-colors'
import fonts from 'grape-theme/fonts'

export default {
  container: {
    extend: fonts.normal,
    height: '100%',
    boxShadow: 'inset 0px 0px 3px 3px rgba(0,0,0,0.10)',
    color: colors.grapeTypo,
  },
  contentWrapper: {
    padding: 15
  },
  title: {
    extend: fonts.big,
    margin: 0
  },
  subtitle: {
    extend: fonts.normal,
    margin: '5px 0',
    color: colors.gainsboroDark
  },
  description: {
    margin: '0 0 10px 0'
  }
}
