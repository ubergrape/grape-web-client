import utils from 'grape-jss-utils'
import colors from 'grape-theme/dist/base-colors'

const avatarWidth = 32
const leftColumnMarginRight = 5
const arrowWidth = 7

export default {
  message: {
    margin: '0 0 15px'
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
    // overflow: 'hidden'
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
    marginRight: 10
  },
  date: {
    whiteSpace: 'nowrap',
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
    transition: 'box-shadow 0.3s ease-out',
    '&:hover': {
      boxShadow: '0px 1px 8px rgba(0,0,0,0.3)',
    },
    '&:after': {
      display: 'block',
      width: 0,
      content: '""',
      position: 'absolute',
      top: 6,
      left: -4,
      bottom: 'auto',
      borderWidth: `${arrowWidth}px ${arrowWidth}px ${arrowWidth}px 0`,
      borderStyle: 'solid',
      borderColor: 'transparent white'
    }
  }
}
