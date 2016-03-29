import colors from 'grape-theme/dist/base-colors'
import buttonReset from '../button/reset'
import getColoredIcon from 'grape-web/lib/svg-icons/getColored'

const {
  gray,
  grayBlueLight,
  grayBlueLighter
} = colors

export default {
  token: {
    ...buttonReset,
    lineHeight: 1,
    padding: '3px 17px 3px 5px',
    marginRight: 5,
    marginBottom: 2,
    background: `${grayBlueLighter} calc(100% - 5px) 50% no-repeat`,
    backgroundImage: `url(${getColoredIcon({name: 'close', color: gray})})`,
    backgroundSize: 7,
    border: `1px solid ${grayBlueLight}`,
    color: gray,
    cursor: 'pointer',
    borderRadius: 4,
    '&:hover': {
      backgroundColor: grayBlueLight
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
