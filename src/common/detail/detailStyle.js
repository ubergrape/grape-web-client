import colors from 'grape-theme/base-colors'
import fonts from 'grape-theme/fonts'

export const HEADER_HEIGHT = 110

export let style = {
  previewWrapper: {
    textAlign: 'center',
    background: colors.gainsboroLight,
    lineHeight: 0
  },
  preview: {
    maxWidth: '100%',
    maxHeight: HEADER_HEIGHT,
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
