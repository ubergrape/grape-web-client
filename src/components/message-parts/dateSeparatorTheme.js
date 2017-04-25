import {borderDefault} from 'grape-theme/dist/web-colors'
import {small, normal} from 'grape-theme/dist/fonts'

export const styles = {
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
      isolate: false,
      marginTop: 0
    }
  },
  date: {
    extend: small,
    position: 'relative',
    fontWeight: 'bold',
    padding: [3, normal.fontSize]
  }
}
