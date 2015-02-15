import Color from 'color'
import colors from 'ubergrape-theme/base-colors'

export default {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    background: colors.white,
    border: '1px solid ' + colors.gainsboroLight,
    boxShadow: '0px 3px 4px 0 ' + Color(colors.grapeTypo).alpha(.5).hslString()
  }
}
