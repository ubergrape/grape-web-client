import colors from 'grape-theme/dist/base-colors'
import fonts from 'grape-theme/dist/fonts'
import sizes from 'grape-theme/dist/sizes'
import utils from 'grape-jss-utils'
import color from 'color'

export let container = {
  display: 'flex',
  height: 42,
  position: 'relative',
  background: colors.white,
  color: colors.grapeTypo,
  cursor: 'pointer',
  userSelect: 'none',
  borderBottom: '1px solid ' + colors.silverDark
}

let icon = {
  marginBottom: 2
}

let metaItem = {
  ...fonts.small,
  display: 'block',
  marginLeft: 4,
  padding: '2px 6px',
  borderRadius: sizes.borderRadius.small,
  border: '1px solid ' + colors.silverDark,
  backgroundColor: colors.silverLight,
  color: colors.gainsboroDark
}

export let rules = {
  container: container,
  containerFocused: {
    ...container,
    color: colors.white,
    background: colors.grapeLight
  },
  iconContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '6px 16px'
  },
  icon: {
    ...icon,
    color: color(colors.gainsboroDark).lighten(0.5).rgbaString()
  },
  iconFocused: {
    ...icon,
    color: colors.white
  },
  nameContainer: {
    flex: 1,
    alignSelf: 'center',
    padding: '6px 0',
    minWidth: 1 // firefox 34+ flexbox bug workaround
  },
  name: {
    ...fonts.normal,
    ...utils.ellipsis,
    lineHeight: 1.2
  },
  info: {
    ...fonts.small,
    ...utils.ellipsis,
    marginTop: 4,
    opacity: 0.5
  },
  metaContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: '6px 12px'
  },
  metaItem: metaItem,
  metaItemFocused: {
    ...metaItem,
    color: colors.white,
    backgroundColor: color(colors.grapeLight).lighten(0.2).rgbaString(),
    borderColor: color(colors.grapeLight).lighten(0.4).rgbaString()
  }
}
