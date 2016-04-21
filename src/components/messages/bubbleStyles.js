import {white} from 'grape-theme/dist/base-colors'

const arrowWidth = 7
const transition = 'box-shadow 0.3s ease-out'
const shadowColor = 'rgba(0,0,0,0.3)'

export default {
  bubble: {
    position: 'relative',
    marginLeft: arrowWidth,
    '&:before': {
      position: 'absolute',
      top: 14,
      left: 0,
      width: arrowWidth,
      height: arrowWidth,
      content: '""',
      transform: 'rotate(45deg) translateX(-50%)',
      transition,
      background: white,
      zIndex: 1
    },
    '&:hover:before': {
      boxShadow: `-3px 4px 8px ${shadowColor}`
    }
  },
  content: {
    position: 'relative',
    background: white,
    borderRadius: 16,
    padding: '5px 13px',
    overflow: 'hidden',
    transition,
    wordBreak: 'break-word',
    '&:hover': {
      boxShadow: `0px 1px 8px ${shadowColor}`
    }
  }
}
