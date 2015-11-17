import color from 'color'
import colors from './base-colors'

export default {
  link: colors.aquaLight,
  button: colors.aquaLight,
  buttonBgDefault: '#503c50',
  buttonColorDefault: colors.white,
  buttonBgPrimary: colors.grassLight,
  buttonColorPrimary: color(colors.grassDark).darken(0.5).rgbaString(),
  alertInfo: colors.aquaDark,
  alertSuccess: colors.grassDark,
  alertWarning: colors.gold,
  alertDanger: colors.bittersweetDark,
  roomHeaderBackground: colors.grapeDark,
  chatBackground: colors.white,
  chatContent: colors.silverLight,
  navigationBackground: colors.silverLight,
  organisationBackground: colors.grapeDark,
  searchHighlightColor: '#ffeead',
  sidebarBackground: '#503c50',
  sidebarButtonBackground: '#6e4b6e',
  sidebarGroupTitle: '#aa96aa'
}
