import { normal } from 'grape-theme/dist/fonts'
import { white } from 'grape-theme/dist/base-colors'

export const borderRadius = 16

export const styles = {
  bubble: {
    display: 'inline-block',
    position: 'relative',
    minWidth: 0,
    maxWidth: '100%',
    verticalAlign: 'top',
  },
  bubbleWithArrow: {
    composes: '$bubble',
    '&:before': {
      position: 'absolute',
      top: 14,
      left: 0,
      width: 7,
      height: 7,
      content: '""',
      transform: 'rotate(45deg) translateX(-50%)',
      background: white,
    },
  },
  content: {
    extend: normal,
    display: 'block',
    position: 'relative',
    background: white,
    borderRadius,
    wordBreak: 'break-word',
    '& > *': {
      isolate: false,
      padding: [5, 13],
    },
  },
}
