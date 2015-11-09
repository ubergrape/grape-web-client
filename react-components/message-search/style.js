import button from '../button/style'
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
    position: 'relative',
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
