import {borderDefault} from 'grape-theme/dist/web-colors'
import fonts from 'grape-theme/dist/fonts'

export default {
  separator: {
    marginTop: 25,
    position: 'relative',
    textAlign: 'center',
    '&:before': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: 0,
      height: 1,
      width: '100%',
      background: borderDefault,
      margin: 0
    },
    '&:first-child': {
      marginTop: 0
    }
  },
  date: {
    position: 'relative',
    fontWeight: 'bold',
    padding: `3px ${fonts.normal.fontSize}px`
  }
}
