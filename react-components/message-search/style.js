import colors from 'grape-theme/dist/base-colors'
import fonts from 'grape-theme/dist/fonts'

const dateBubbleVPadding = 3

export default {
  messageSearch: {
  },
  loadMoreContainer: {
    textAlign: 'center'
  },
  dateSeparator: {
    textAlign: 'center'
  },
  dateHr: {
    position: 'absolute',
    // XXX
    background: '#DADCDE',
    height: 1,
    width: '100%',
    marginTop: (dateBubbleVPadding * 2 + fonts.normal.fontSize) / 2
  },
  dateBubble: {
    position: 'relative',
    background: colors.white,
    borderRadius: fonts.normal.fontSize,
    padding: `${dateBubbleVPadding}px ${fonts.normal.fontSize}px`
  },
  channel: {

  },
  message: {
    cursor: 'pointer',
    '&:hover': {
      background: 'blue'
    }
  },
  empty: {
    textAlign: 'center'
  },
  highlighted: {
    background: 'yellow'
  }
}
