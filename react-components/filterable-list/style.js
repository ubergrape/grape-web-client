import colors from 'grape-theme/dist/base-colors'
import color from 'color'

const {grayBlueLighter} = colors

export default {
  filterArea: {
    overflow: 'auto',
    height: 85,
    padding: '10px 10px 0 10px',
    borderRadius: 5,
    border: `1px solid ${color(grayBlueLighter).darken(0.05).hexString()}`
  },
  list: {
    marginTop: 20
  }
}
