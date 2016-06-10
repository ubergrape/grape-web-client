import colors from 'grape-theme/dist/base-colors'
import color from 'color'

export default {
  spinner: {
    position: 'absolute',
    zIndex: 1,
    top: 0,
    left: 0,
    height: '100%',
    width: '100%'
  },
  animation: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'no-repeat center',
    backgroundSize: '100%'
  },
  overlay: {
    background: color(colors.white).alpha(0.7).rgbaString()
  }
}
