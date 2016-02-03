import colors from 'grape-theme/dist/base-colors'
import fonts from 'grape-theme/dist/fonts'

export default {
  textarea: {
    ...fonts.normal,
    position: 'relative',
    zIndex: 1,
    display: 'block',
    width: '100%',
    height: '100%',
    outline: 'none',
    background: 'transparent',
    border: 'none',
    color: colors.black,
    resize: 'none'
  }
}
