import colors from 'grape-theme/dist/base-colors'
import color from 'color'
import buttonReset from '../button/reset'
import getColoredIcon from 'grape-web/lib/svg-icons/getColored'

const {grayBlueLighter} = colors
const tokenColor = '#666666'

export default {
  token: {
    ...buttonReset,
    lineHeight: 1,
    padding: '3px 17px 3px 5px',
    marginRight: 5,
    marginBottom: 2,
    background: `${grayBlueLighter} url(${getColoredIcon({name: 'close', color: tokenColor})}) calc(100% - 5px) 50% no-repeat`,
    backgroundSize: '7px',
    border: `1px solid ${color(grayBlueLighter).darken(0.05).hexString()}`,
    color: tokenColor,
    cursor: 'pointer',
    borderRadius: 4,
    '&:hover': {
      backgroundColor: color(grayBlueLighter).darken(0.05).hexString()
    }
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
