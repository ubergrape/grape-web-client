import colors from 'grape-theme/base-colors'
import fonts from 'grape-theme/fonts'

export default {
  header: {
    textAlign: 'center',
    background: colors.gainsboroLight,
    lineHeight: 0
  },
  preview: {
    maxWidth: '100%',
    height: 'auto',
    width: 'auto'
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
