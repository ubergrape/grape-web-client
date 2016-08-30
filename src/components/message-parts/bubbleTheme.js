import {white} from 'grape-theme/dist/base-colors'

const arrowWidth = 7
const contentPaddingHor = 13

export const styles = {
  bubble: {
    display: 'inline-block',
    position: 'relative',
    maxWidth: `calc(100% - ${arrowWidth}px)`,
    marginLeft: arrowWidth
  },
  bubbleWithArrow: {
    extend: 'bubble',
    '&:before': {
      position: 'absolute',
      top: 14,
      left: 0,
      width: arrowWidth,
      height: arrowWidth,
      content: '""',
      transform: 'rotate(45deg) translateX(-50%)',
      background: white,
      zIndex: 1
    }
  },
  content: {
    position: 'relative',
    background: white,
    borderRadius: 16,
    padding: `5px ${contentPaddingHor}px`,
    wordBreak: 'break-word',
    maxWidth: `calc(100% - ${contentPaddingHor * 2}px)`
  }
}
