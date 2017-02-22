import {createMuiTheme} from 'material-ui/styles/theme'
import {createPalette} from 'material-ui/styles/palette'
import {Input} from 'material-ui/Input'
import {
  white, blue, red, green, grayBlueLighter, grayLighter, grayDark
} from 'grape-theme/dist/base-colors'
import merge from 'lodash/object/merge'

const palette = createPalette()

palette.primary[100] = white
palette.primary[500] = green
palette.error[500] = red
palette.accent.A200 = blue
palette.text.primary = grayDark
palette.text.divider = grayLighter
palette.text.lightDivider = grayBlueLighter

const MuiLinearProgress = {
  root: {
    height: 9,
    borderRadius: 5
  },
  determinateBar1: {
    background: {
      image: '-webkit-gradient(linear, 0 0, 100% 100%, color-stop(.25, rgba(255, 255, 255, .2)), color-stop(.25, rgba(0, 0, 0, 0)), color-stop(.5, rgba(0, 0, 0, 0)), color-stop(.5, rgba(255, 255, 255, .2)), color-stop(.75, rgba(255, 255, 255, .2)), color-stop(.75, rgba(0, 0, 0, 0)), to(rgba(0, 0, 0, 0)) )',
      size: [20, 20]
    },
    animation: 'determinate-1 2s linear infinite'
  },
  '@keyframes determinate-1': {
    from: {
      backgroundPosition: [0, 0]
    },
    to: {
      backgroundPosition: [20, 20]
    }
  }
}

const MuiMenuItem = {
  root: {
    height: 'auto'
  }
}

const inputHorizontalSpacing = 10

const MuiInput = {
  wrapper: {
    border: {
      width: 1,
      style: 'solid',
      color: palette.text.divider,
      radius: 5
    },
    padding: [0, inputHorizontalSpacing]
  },
  formControl: {
    marginTop: 5,
    marginBottom: 5
  },
  focused: {
    borderColor: palette.accent.A200
  },
  error: {
    borderColor: palette.error[500]
  }
}

Input.defaultProps.underline = false

const MuiFormLabel = {
  root: {
    marginLeft: inputHorizontalSpacing
  },
  focused: {
    color: palette.text.primary
  }
}

export const create = theme => createMuiTheme(merge({
  palette,
  overrides: {
    MuiLinearProgress,
    MuiMenuItem,
    MuiInput,
    MuiFormLabel
  }
}, theme))

export default create()
