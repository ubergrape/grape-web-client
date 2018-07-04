import createPalette, { light } from 'material-ui/styles/createPalette'
import {
  white,
  blue,
  red,
  green,
  orange,
  grayBlue,
  grayBlueLight,
  grayBlueLighter,
  grayBlueDark,
  grayLighter,
  grayLight,
  grayDark,
  grayMercury,
  grayBombay,
  grayDarker,
} from 'grape-theme/dist/base-colors'
import orangePalette from 'material-ui/colors/orange'
import color from 'color'

const palette = createPalette(light)

palette.primary[100] = white
palette.primary[500] = green
palette.primary[700] = color(green)
  .lighten(0.2)
  .rgbaString()

palette.secondary[500] = color(orange)
  .lighten(0.2)
  .rgbaString()
palette.secondary[700] = orange
palette.secondary.A200 = blue
palette.secondary.A100 = color(blue)
  .lighten(0.2)
  .rgbaString()

palette.error[500] = red
palette.error[700] = color(red)
  .lighten(0.2)
  .rgbaString()

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
palette.blueGrey[70] = color(grayBlueLighter)
  .darken(0.05)
  .hexString()
palette.blueGrey[100] = grayBlueLight
palette.blueGrey[400] = grayBlue

palette.action.active = grayDark

export default palette
