import {normal} from 'grape-theme/dist/fonts'
import {white} from 'grape-theme/dist/base-colors'

export const styles = {
  bubble: {
    display: 'inline-block',
    position: 'relative'
  },
  bubbleWithArrow: {
    extend: 'bubble',
    '&:before': {
      position: 'absolute',
      top: 14,
      left: 0,
      width: 7,
      height: 7,
      content: '""',
      transform: 'rotate(45deg) translateX(-50%)',
      background: white,
      zIndex: 1
    }
  },
  content: {
    extend: normal,
    position: 'relative',
    background: white,
    borderRadius: 16,
    padding: '5px 13px',
    wordBreak: 'break-word'
  }
}
