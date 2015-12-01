import button from '../button/default'
import colors from 'grape-theme/dist/base-colors'
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
      // XXX
      background: '#DADCDE',
      margin: 0
    },
    '&:first-child': {
      marginTop: 0
    }
  },
  dateBubble: {
    position: 'relative',
    fontWeight: 'bold',
    background: colors.grayBlueLight,
    padding: `3px ${fonts.normal.fontSize}px`,
  },
  channel: {
    // XXX
    color: '#ABB0B9',
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
    // XXX
    background: '#FFF3B9'
  },
  button
}
