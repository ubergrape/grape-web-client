import fonts from 'grape-theme/dist/fonts'
import getColoredIcon from 'grape-web/lib/svg-icons/getColored'
import {grayBlueLighter, red, orange} from 'grape-theme/dist/base-colors'
import color from 'color'

export const placement = 'bottom'
export const tooltipOffset = 9
export const arrowOffset = 30
export const horizontalPadding = 10

const input = {
  width: '100%',
  outline: 'none',
  padding: `1px ${horizontalPadding}px`,
  borderRadius: 5,
  border: '1px solid',
  '&:disabled': {
    opacity: 0.6,
    pointerEvents: 'none'
  }
}

function message(iconColor) {
  return {
    paddingLeft: '1.5em',
    background: 'no-repeat',
    backgroundSize: '1em',
    backgroundImage: `url('${getColoredIcon({name: 'warning', color: iconColor})}')`
  }
}

export const styles = {
  input: {
    ...input,
    borderColor: color(grayBlueLighter).darken(0.05).hexString()
  },
  inputError: {
    ...input,
    borderColor: red
  },
  inputWarning: {
    ...input,
    borderColor: orange
  },
  content: {
    ...fonts.normal,
    padding: '7px 14px'
  },
  warningMessage: {
    ...message(orange)
  },
  errorMessage: {
    ...message(red)
  }
}
