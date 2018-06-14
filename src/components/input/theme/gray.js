import fonts from 'grape-theme/dist/fonts'
import getColoredIcon from 'grape-web/lib/svg-icons/getColored'
import prefixSelector from 'grape-web/lib/jss-utils/prefixSelector'
import {
  grayLight,
  grayBlueLighter,
  red,
  orange,
} from 'grape-theme/dist/base-colors'
import color from 'color'

export const placement = 'bottom'
export const tooltipOffsetLeft = 9
export const tooltipOffsetTop = 35
export const arrowOffset = 30
export const horizontalPadding = 10

const input = {
  width: '100%',
  outline: 'none',
  padding: [1, horizontalPadding],
  borderRadius: 5,
  border: [1, 'solid'],
  '&:disabled': {
    isolate: false,
    opacity: 0.6,
    pointerEvents: 'none',
  },
  [`&${prefixSelector('::input-placeholder')}`]: {
    isolate: false,
    color: grayLight,
  },
}

function message(iconColor) {
  return {
    paddingLeft: '1.5em',
    background: 'no-repeat',
    backgroundSize: '1em',
    backgroundImage: `url('${getColoredIcon({
      name: 'warning',
      color: iconColor,
    })}')`,
  }
}

export const styles = {
  input: {
    ...input,
    borderColor: color(grayBlueLighter)
      .darken(0.05)
      .hexString(),
  },
  inputError: {
    ...input,
    borderColor: red,
  },
  inputWarning: {
    ...input,
    borderColor: orange,
  },
  content: {
    ...fonts.normal,
    padding: '7px 14px',
  },
  warningMessage: {
    ...message(orange),
  },
  errorMessage: {
    ...message(red),
  },
}
