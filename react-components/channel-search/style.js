import button from '../button/style'
import fonts from 'grape-theme/dist/fonts'

export default {
  content: {
    padding: 15,
    height: 300,
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    width: '100%'
  },
  datalist: {
    overflow: 'auto'
  },
  item: {
    cursor: 'pointer',
    '&:hover': {
      background: 'blue'
     }
  },
  fallback: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  },
  fallbackHeadline: {
    ...fonts.normal,
    marginBottom: 20
  },
  button: button
}

