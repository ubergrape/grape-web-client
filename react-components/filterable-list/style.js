import colors from 'grape-theme/dist/base-colors'
import color from 'color'

const {grayBlueLighter} = colors

export default {
  token: {
    display: 'inline-block',
    lineHeight: 1,
    padding: '3px 5px',
    cursor: 'pointer',
    color: '#666',
    backgroundColor: grayBlueLighter,
    border: `1px solid ${color(grayBlueLighter).darken(0.05).hexString()}`,
    borderRadius: 4,
    marginRight: 5,
    marginBottom: 2,
    '&:hover': {
      backgroundColor: color(grayBlueLighter).darken(0.05).hexString()
    }
  },
  selectedList: {
    display: 'inline'
  },
  remove: {
    marginLeft: 3,
    verticalAlign: 'middle'
  },
  filterArea: {
    overflow: 'auto',
    height: 85,
    padding: '10px 10px 0 10px',
    borderRadius: 5,
    border: `1px solid ${color(grayBlueLighter).darken(0.05).hexString()}`
  },
  filter: {
    display: 'inline-block',
    minWidth: 15,
    padding: 0,
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent'
  },
  ruler: {
    position: 'fixed',
    top: -100,
    left: -1000,
    visibility: 'hidden'
  },
  list: {
    marginTop: 20
  }
}
