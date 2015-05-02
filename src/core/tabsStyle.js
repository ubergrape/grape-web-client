import colors from 'grape-theme/base-colors'
import Color from 'color'

export default {
  tabs: {
    display: 'block',
    padding: 0,
    height: '100%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    background: Color(colors.grapeDark).darken(.5).rgbaString()
  }
}
