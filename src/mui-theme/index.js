import {createMuiTheme} from 'material-ui/styles/theme'
import {createPalette} from 'material-ui/styles/palette'
import createTypography from 'material-ui/styles/typography'
import {Input} from 'material-ui/Input'
import {
  white, blue, red, green, grayBlueLighter, grayLighter, grayDark, grayMercury
} from 'grape-theme/dist/base-colors'
import {normal} from 'grape-theme/dist/fonts'
import {borderRadius} from 'grape-theme/dist/sizes'
import merge from 'lodash/object/merge'
import color from 'color'

const palette = createPalette()

palette.primary[100] = white
palette.primary[500] = green
palette.primary[700] = color(green).lighten(0.2).rgbaString()
palette.error[500] = red
palette.error[700] = color(red).lighten(0.2).rgbaString()
palette.accent.A200 = blue
palette.accent.A100 = color(blue).lighten(0.2).rgbaString()
palette.text.primary = grayDark
palette.text.divider = grayLighter
palette.text.lightDivider = grayBlueLighter
palette.grey[200] = grayMercury

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

const MuiButton = {
  root: {
    textTransform: 'none',
    height: 'auto',
    padding: [0, 14],
    '&:hover': {
      textDecoration: 'none',
      backgroundColor: 'transparent',
      color: palette.accent.A100
    }
  },
  raised: {
    border: {
      width: 1,
      style: 'solid',
      color: palette.grey[300],
      radius: borderRadius.big
    },
    backgroundColor: 'transparent',
    padding: [4, 14],
    '&:hover': {
      backgroundColor: palette.grey[300],
      color: palette.getContrastText(palette.grey[300])
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

export const create = theme => createMuiTheme(merge({
  typography,
  palette,
  overrides: {
    MuiLinearProgress,
    MuiMenuItem,
    MuiInput,
    MuiFormLabel,
    MuiButton
  }
}, theme))

export default create()
