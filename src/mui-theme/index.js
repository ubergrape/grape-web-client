import {createMuiTheme} from '@ubergrape/material-ui/styles/theme'
import {createPalette} from '@ubergrape/material-ui/styles/palette'
import {white, green, blue} from 'grape-theme/dist/base-colors'
import merge from 'lodash/object/merge'

const palette = createPalette()

palette.primary[100] = white
palette.primary[500] = green

const LinearProgress = {
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

const MenuItem = {
  root: {
    height: 'auto',
    '&:hover': {
      backgroundColor: blue,
      color: palette.primary[100]
    },
    '&:focus': {
      backgroundColor: blue,
      color: palette.primary[100]
    }
  }
}

export const create = theme => createMuiTheme(merge({
  palette,
  overrides: {
    LinearProgress,
    MenuItem
  }
}, theme))

export default create()
