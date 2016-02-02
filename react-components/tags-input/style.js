import colors from 'grape-theme/dist/base-colors'
import buttonReset from '../button/reset'
import getColoredIcon from 'grape-web/lib/svg-icons/getColored'

const {grayBlueLighter} = colors

export default {
  token: {
    ...buttonReset,
    lineHeight: 1,
    padding: '3px 17px 3px 5px',
    marginRight: 5,
    marginBottom: 2,
    background: `${grayBlueLighter} url(${getColoredIcon({name: 'close', color: colors.gray})}) calc(100% - 5px) 50% no-repeat`,
    backgroundSize: '7px',
    border: `1px solid ${colors.grayBlueLight}`,
    color: colors.gray,
    cursor: 'pointer',
    borderRadius: 4,
    '&:hover': {
      backgroundColor: colors.grayBlueLight
    }
  },
  input: {
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
  }
}
