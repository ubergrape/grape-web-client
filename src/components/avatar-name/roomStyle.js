import {white} from 'grape-theme/dist/base-colors'
import {smaller} from 'grape-theme/dist/fonts'
import style from './style'

export default {
  ...style,
  abbr: {
    textAlign: 'center',
    flexShrink: 0,
    color: white,
    lineHeight: '32px'
  },
  info: {
    extend: smaller,
    display: 'flex',
    '& .mdi': {
      marginRight: 3
    }
  },
  creator: {
    marginLeft: 10
  }
}
