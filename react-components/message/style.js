import utils from 'grape-jss-utils'
import colors from 'grape-theme/dist/base-colors'

const avatarWidth = 32
const leftColumnMarginRight = 5
const arrowWidth = 7
const shadowTransition = 'box-shadow 0.3s ease-out'
const shadowColor = 'rgba(0,0,0,0.3)'

export default {
  message: {
    margin: '0 0 15px'
  },
  body: {
    display: 'flex'
  },
  leftColumn: {
    flexShrink: 0,
    marginRight: leftColumnMarginRight
  },
  rightColumn: {
    flex: 1,
    position: 'relative',
    marginLeft: arrowWidth,
    '&:before': {
      display: 'block',
      width: arrowWidth,
      height: arrowWidth,
      content: '""',
      position: 'absolute',
      top: 14,
      left: 0,
      transform: 'rotate(45deg) translateX(-50%)',
      transition: shadowTransition,
      background: colors.white,
      zIndex: 1
    },
    '&:hover:before': {
      boxShadow: `-3px 4px 8px ${shadowColor}`
    }
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
    overflow: 'hidden',
    transition: shadowTransition,
    '&:hover': {
      boxShadow: `0px 1px 8px ${shadowColor}`
    }
  }
}
