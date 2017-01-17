import color from 'color'
import colors from 'grape-theme/dist/base-colors'
import {small} from 'grape-theme/dist/fonts'
import getColoredIcon from 'grape-web/lib/svg-icons/getColored'

import buttonReset from '../button/reset'

const {
  gray,
  grayBlueLight,
  grayBlueLighter
} = colors

export const styles = {
  filterArea: {
    overflow: 'auto',
    maxHeight: 85,
    padding: '0 10px',
    borderRadius: 5,
    border: `1px solid ${color(grayBlueLighter).darken(0.05).hexString()}`
  },
  token: {
    extend: [buttonReset, small],
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
      isolate: false,
      backgroundColor: grayBlueLight
    }
  },
  input: {
    extend: small,
    display: 'inline-block',
    minWidth: 15,
    padding: '10px 0 7px 0',
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent'
  },
  inputRuler: {
    position: 'fixed',
    top: -100,
    left: -1000,
    visibility: 'hidden'
  },
  placeholder: {
    extend: small,
    position: 'absolute',
    opacity: 0.5,
    transform: 'translateY(50%)'
  }
}
