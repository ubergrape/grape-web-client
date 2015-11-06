import colors from 'grape-theme/dist/base-colors'

const avatarWidth = 43
const leftColumnMarginRight = 5
const arrowWidth = 7

export default {
  message: {
    margin: '10px 0'
  },
  body: {
    display: 'flex',
    flexDirection: 'row'
  },
  leftColumn: {
    flexShrink: 0,
    marginRight: leftColumnMarginRight
  },
  rightColumn: {
    overflow: 'hidden'
  },
  avatar: {
    width: avatarWidth,
    height: avatarWidth,
    borderRadius: '50%',
    background: 'no-repeat center',
    backgroundSize: '100%'
  },
  header: {
    marginLeft: avatarWidth + leftColumnMarginRight + arrowWidth
  },
  author: {
    // XXX
    color: '#666',
    marginRight: 5
  },
  date: {
    // XXX
    color: '#AAA'
  },
  content: {
    position: 'relative',
    background: colors.white,
    borderRadius: 10,
    padding: '6px 8px',
    marginLeft: arrowWidth,
    '&:after': {
      display: 'block',
      width: 0,
      content: '""',
      position: 'absolute',
      top: 10,
      left: -arrowWidth,
      bottom: 'auto',
      borderWidth: `${arrowWidth}px ${arrowWidth}px ${arrowWidth}px 0`,
      borderStyle: 'solid',
      borderColor: 'transparent white'
    }
  }
}
