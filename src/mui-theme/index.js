import {createMuiTheme} from 'material-ui/styles/theme'
import {createPalette} from 'material-ui/styles/palette'
import {white, green} from 'grape-theme/dist/base-colors'

const palette = createPalette()

palette.primary[100] = white
palette.primary[500] = green

export const LinearProgress = {
  root: {
    height: 9,
    borderRadius: 5
  }
}

export default createMuiTheme({
  palette,
  overrides: {
    LinearProgress
  }
})
