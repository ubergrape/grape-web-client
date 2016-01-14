import button from '../button/default'
import colors from 'grape-theme/dist/base-colors'
import webColors from 'grape-theme/dist/web-colors'
import fonts from 'grape-theme/dist/fonts'

export default {
  messageSearch: {
  },
  loadMoreContainer: {
    textAlign: 'center'
  },
  dateSeparator: {
    marginTop: 25,
    position: 'relative',
    textAlign: 'center',
    '&:before': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: 0,
      height: 1,
      width: '100%',
      background: webColors.borderDefault,
      margin: 0
    },
    '&:first-child': {
      marginTop: 0
    }
  },
  dateBubble: {
    position: 'relative',
    fontWeight: 'bold',
    background: colors.grayBlueLighter,
    padding: `3px ${fonts.normal.fontSize}px`
  },
  channel: {
    color: colors.grayBlue,
    textTransform: 'uppercase',
    marginTop: 20,
    marginBottom: 5,
    lineHeight: 1
  },
  message: {
    cursor: 'pointer'
  },
  empty: {
    textAlign: 'center'
  },
  highlighted: {
    background: colors.yellow
  },
  button
}
