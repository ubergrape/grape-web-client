import createMuiTheme from 'material-ui/styles/createMuiTheme'
import createPalette, {light} from 'material-ui/styles/createPalette'
import createTypography from 'material-ui/styles/createTypography'
import Input from 'material-ui/Input'
import {
  white, blue, red, green, orange,
  grayBlue, grayBlueLight, grayBlueLighter, grayBlueDark,
  grayLighter, grayLight, grayDark, grayMercury, grayBombay, grayDarker
} from 'grape-theme/dist/base-colors'
import orangePalette from 'material-ui/colors/orange'

import {normal} from 'grape-theme/dist/fonts'
import {borderRadius} from 'grape-theme/dist/sizes'
import merge from 'lodash/object/merge'
import color from 'color'

export const palette = createPalette(light)

palette.primary[100] = white
palette.primary[500] = green
palette.primary[700] = color(green).lighten(0.2).rgbaString()

palette.secondary[500] = color(orange).lighten(0.2).rgbaString()
palette.secondary[700] = orange
palette.secondary.A200 = blue
palette.secondary.A100 = color(blue).lighten(0.2).rgbaString()

palette.error[500] = red
palette.error[700] = color(red).lighten(0.2).rgbaString()

palette.text.primary = grayDark
palette.text.secondary = grayBlueDark
palette.text.lightDivider = grayBlueLighter

palette.grey[100] = grayLight
palette.grey[200] = grayMercury
palette.grey[300] = grayBombay
palette.grey.A100 = grayLighter
palette.grey.A400 = grayDarker

palette.orange = orangePalette

palette.blueGrey = palette.blueGrey || {}
palette.blueGrey[50] = grayBlueLighter
palette.blueGrey[70] = color(grayBlueLighter).darken(0.05).hexString()
palette.blueGrey[100] = grayBlueLight
palette.blueGrey[400] = grayBlue

palette.action.active = grayDark

export const typographyConstants = {
  fontFamily: '"proxima-nova", "Helvetica Neue", Arial, Helvetica, sans-serif',
  fontSize: normal.fontSize,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500
}

const typography = createTypography(palette, typographyConstants)

const MuiLinearProgress = {
  root: {
    height: 9,
    borderRadius: borderRadius.big
  },
  determinateBar1: {
    background: {
      image: '-webkit-gradient(linear, 0 0, 100% 100%, color-stop(.25, rgba(255, 255, 255, .2)), color-stop(.25, rgba(0, 0, 0, 0)), color-stop(.5, rgba(0, 0, 0, 0)), color-stop(.5, rgba(255, 255, 255, .2)), color-stop(.75, rgba(255, 255, 255, .2)), color-stop(.75, rgba(0, 0, 0, 0)), to(rgba(0, 0, 0, 0)) )',
      size: [20, 20]
    },
    animation: 'mui-indeterminate2 2s linear infinite'
  },
  // FIXME it should not be using animation designed for indeterminate style progress,
  // the new validation of mui doesn't allows to use names which mui isn't using already.
  // Should be fixed in JSS by allowing keyframes inside of the rules and evtl with auto
  // generated name https://github.com/cssinjs/jss/issues/346
  '@keyframes mui-indeterminate2': {
    '0%': {
      left: 0,
      right: 0,
      backgroundPosition: [0, 0]
    },
    '60%': {
      left: 0,
      right: 0
    },
    '100%': {
      left: 0,
      right: 0,
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
  root: {
    border: {
      width: 1,
      style: 'solid',
      color: palette.grey[200],
      radius: borderRadius.big
    },
    padding: [0, inputHorizontalSpacing]
  },
  formControl: {
    marginTop: 5,
    marginBottom: 5
  },
  focused: {
    borderColor: palette.secondary.A200
  },
  error: {
    borderColor: palette.error[500]
  }
}
Input.Naked.defaultProps.disableUnderline = true

const MuiFormLabel = {
  root: {
    marginLeft: inputHorizontalSpacing
  },
  focused: {
    color: palette.text.primary
  },
  error: {
    color: palette.error[500]
  }
}

const MuiButton = {
  root: {
    textTransform: 'none',
    height: 'auto',
    padding: [0, 14],
    '&[href]': {
      padding: 0,
      backgroundColor: 'transparent',
      color: palette.secondary.A200,
      fontSize: 'inherit'
    },
    '&[href]:hover': {
      color: palette.secondary.A100
    }
  },
  raised: {
    border: {
      width: 1,
      style: 'solid',
      color: palette.grey[300],
      radius: borderRadius.big
    },
    backgroundColor: white,
    padding: [4, 14],
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: palette.grey.A100,
      '&$disabled': {
        backgroundColor: palette.text.divider
      }
    },
    '&, &$keyboardFocused, &:active, &$disabled': {
      boxShadow: 'none'
    }
  },
  raisedPrimary: {
    backgroundColor: palette.primary[500],
    borderColor: palette.primary[500],
    color: palette.primary[100],
    '&:hover': {
      backgroundColor: palette.primary[700],
      borderColor: palette.primary[700],
      color: palette.primary[100]
    }
  },
  raisedAccent: {
    backgroundColor: palette.error[500],
    borderColor: palette.error[500],
    '&:hover': {
      backgroundColor: palette.error[700],
      borderColor: palette.error[700],
      color: palette.primary[100]
    }
  }
}

const MuiChip = {
  root: {
    height: 'auto',
    padding: [5, 0]
  },
  label: {
    isolate: false
  }
}

const MuiPopover = {
  paper: {
    borderRadius: borderRadius.bigger
  }
}

export const create = theme => createMuiTheme(merge({
  typography,
  palette,
  overrides: {
    MuiLinearProgress,
    MuiMenuItem,
    MuiInput,
    MuiFormLabel,
    MuiButton,
    MuiChip,
    MuiPopover
  }
}, theme))

export default create()
