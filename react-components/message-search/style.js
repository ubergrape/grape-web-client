import button from '../button/style'
import colors from 'grape-theme/dist/base-colors'
import fonts from 'grape-theme/dist/fonts'

export default {
  messageSearch: {
  },
  loadMoreContainer: {
    textAlign: 'center'
  },
  dateSeparator: {
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
    }
  },
  dateBubble: {
    position: 'relative',
    background: colors.white,
    borderRadius: fonts.normal.fontSize,
    padding: `3px ${fonts.normal.fontSize}px`,
    // XXX
    border: '1px solid #DADCDE'
  },
  channel: {
    // XXX
    color: '#ABB0B9',
    textTransform: 'uppercase',
    marginTop: 15
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
