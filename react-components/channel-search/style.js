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
  list: {
  },
  item: {
    cursor: 'pointer'
  },
  itemFocused: {
    background: 'blue'
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
