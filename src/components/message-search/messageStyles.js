import {styles as linkStyles} from '../message-parts/linkTheme'

const arrowWidth = 7
const marginRight = 10
const avatarWidth = 32
const shadowColor = 'rgba(0,0,0,0.3)'
const transition = 'box-shadow 150ms ease-out'

export default {
  message: {
    margin: '0 0 15px'
  },
  body: {
    display: 'flex'
  },
  header: {
    paddingLeft: avatarWidth + marginRight + arrowWidth
  },
  leftColumn: {
    flexShrink: 0,
    marginRight
  },
  rightColumn: {
    flex: 1,
    width: '100%'
  },
  bubble: {
    '&:hover:before': {
      transition,
      boxShadow: `-3px 4px 8px ${shadowColor}`
    }
  },
  content: {
    transition,
    '&:hover': {
      boxShadow: `0px 1px 8px ${shadowColor}`
    },
    '& a': linkStyles.link,
    '& pre': {
      display: 'block',
      // FIXME: replace with theme colors.
      color: '#4d4d4d',
      border: '1px solid #dad6e0'
    }
  }
}
