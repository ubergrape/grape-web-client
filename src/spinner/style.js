import colors from 'grape-theme/dist/base-colors'
import color from 'color'

export default {
  spinner: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    background: 'no-repeat center'
  },
  overlay: {
    backgroundColor: color(colors.white).alpha(0.7).rgbaString()
  }
}
