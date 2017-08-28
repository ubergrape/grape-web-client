import {normal} from 'grape-theme/dist/fonts'
import {white} from 'grape-theme/dist/base-colors'

export const borderRadius = 16

export const styles = {
  bubble: {
    display: 'inline-block',
    position: 'relative',
    minWidth: 0,
    maxWidth: '100%'
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
      background: white
    }
  },
  content: {
    extend: normal,
    display: 'block',
    position: 'relative',
    background: white,
    borderRadius,
    padding: '5px 13px',
    wordBreak: 'break-word',
    '& > pre': {
      lineHeight: 1
    },
    '& > pre > code': {
      lineHeight: normal.lineHeight,
      verticalAlign: 'middle'
    },
    '& > p, > pre': {
      marginTop: normal.fontSize / 2,
      '&:first-child': {
        marginTop: 0
      }
    }
  }
}
