import utils from 'grape-jss-utils'
import colors from 'grape-theme/dist/base-colors'

const avatarWidth = 32
const leftColumnMarginRight = 5
const arrowWidth = 7

export default {
  message: {
    margin: '5px 0 10px'
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
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden',
    width: '100%',
    paddingLeft: avatarWidth + leftColumnMarginRight + arrowWidth
  },
  author: {
    ...utils.ellipsis,
    // XXX
    color: '#666',
    marginRight: 5
  },
  date: {
    // XXX
    color: '#AAA',
    width: 52,
    flexShrink: 0
  },
  content: {
    position: 'relative',
    background: colors.white,
    borderRadius: 16,
    padding: '5px 13px',
    marginLeft: arrowWidth,
    '&:after': {
      display: 'block',
      width: 0,
      content: '""',
      position: 'absolute',
      top: 7,
      left: -5,
      bottom: 'auto',
      borderWidth: `${arrowWidth}px ${arrowWidth}px ${arrowWidth}px 0`,
      borderStyle: 'solid',
      borderColor: 'transparent white'
    }
  }
}
