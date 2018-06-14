import { borderRadius } from 'grape-theme/dist/sizes'
import palette from './palette'

export const MuiLinearProgress = {
  root: {
    height: 9,
    borderRadius: borderRadius.big,
  },
  determinateBar1: {
    background: {
      image:
        '-webkit-gradient(linear, 0 0, 100% 100%, color-stop(.25, rgba(255, 255, 255, .2)), color-stop(.25, rgba(0, 0, 0, 0)), color-stop(.5, rgba(0, 0, 0, 0)), color-stop(.5, rgba(255, 255, 255, .2)), color-stop(.75, rgba(255, 255, 255, .2)), color-stop(.75, rgba(0, 0, 0, 0)), to(rgba(0, 0, 0, 0)) )',
      size: [20, 20],
    },
    animation: 'mui-indeterminate2 2s linear infinite',
  },
  // FIXME it should not be using animation designed for indeterminate style progress,
  // the new validation of mui doesn't allows to use names which mui isn't using already.
  // Should be fixed in JSS by allowing keyframes inside of the rules and evtl with auto
  // generated name https://github.com/cssinjs/jss/issues/346
  '@keyframes mui-indeterminate2': {
    '0%': {
      left: 0,
      right: 0,
      backgroundPosition: [0, 0],
    },
    '60%': {
      left: 0,
      right: 0,
    },
    '100%': {
      left: 0,
      right: 0,
      backgroundPosition: [20, 20],
    },
  },
}

export const MuiMenuItem = {
  root: {
    height: 'auto',
  },
}

const inputHorizontalSpacing = 10

export const MuiInput = {
  root: {
    border: {
      width: 1,
      style: 'solid',
      color: palette.grey[200],
      radius: borderRadius.big,
    },
    padding: [0, inputHorizontalSpacing],
  },
  formControl: {
    marginTop: 5,
    marginBottom: 5,
  },
  focused: {
    borderColor: palette.secondary.A200,
  },
  error: {
    borderColor: palette.error[500],
  },
}

export const MuiFormLabel = {
  root: {
    marginLeft: inputHorizontalSpacing,
  },
  focused: {
    color: palette.text.primary,
  },
  error: {
    color: palette.error[500],
  },
}

export const MuiButton = {
  root: {
    textTransform: 'none',
    height: 'auto',
    padding: [0, 14],
    '&[href]': {
      padding: 0,
      backgroundColor: 'transparent',
      color: palette.secondary.A200,
      fontSize: 'inherit',
    },
    '&[href]:hover': {
      color: palette.secondary.A100,
    },
  },
  raised: {
    border: {
      width: 1,
      style: 'solid',
      color: palette.grey[300],
      radius: borderRadius.big,
    },
    backgroundColor: palette.common.white,
    padding: [4, 14],
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: palette.grey.A100,
      '&$disabled': {
        backgroundColor: palette.text.divider,
      },
    },
    '&, &$keyboardFocused, &:active, &$disabled': {
      boxShadow: 'none',
    },
  },
  raisedPrimary: {
    backgroundColor: palette.primary[500],
    borderColor: palette.primary[500],
    color: palette.primary[100],
    '&:hover': {
      backgroundColor: palette.primary[700],
      borderColor: palette.primary[700],
      color: palette.primary[100],
    },
  },
  raisedAccent: {
    backgroundColor: palette.error[500],
    borderColor: palette.error[500],
    '&:hover': {
      backgroundColor: palette.error[700],
      borderColor: palette.error[700],
      color: palette.primary[100],
    },
  },
}

export const MuiChip = {
  root: {
    height: 'auto',
    padding: [5, 0],
  },
  label: {
    isolate: false,
  },
}

export const MuiPopover = {
  paper: {
    borderRadius: borderRadius.bigger,
  },
}
