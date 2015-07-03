import colors from 'grape-theme/base-colors'
import Color from 'color'

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
    backgroundColor: Color(colors.white).alpha(.7).rgbaString(),
  }
}
