import colors from 'grape-theme/base-colors'
import fonts from 'grape-theme/fonts'
import sizes from 'grape-theme/sizes'
import utils from 'grape-jss-utils'
import Color from 'color'

export let container = {
  display: 'flex',
  height: 42,
  position: 'relative',
  color: colors.grapeTypo,
  cursor: 'pointer',
  userSelect: 'none',
  borderBottom: '1px solid ' + colors.silverDark
}

let icon = {
  marginBottom: 2
}

let metaItem = {
  extend: fonts.small,
  display: 'block',
  marginLeft: 4,
  padding: '2px 6px',
  borderRadius: sizes.borderRadius.small,
  border: '1px solid ' + colors.silverDark,
  backgroundColor: colors.silverLight,
  color: colors.gainsboroDark
}

export let style = {
  container: {
    extend: container
  },
  containerFocused: {
    extend: container,
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
    extend: icon,
    color: Color(colors.gainsboroDark).lighten(.5).rgbaString()
  },
  iconFocused: {
    extend: icon,
    color: colors.white
  },
  nameContainer: {
    flex: 1,
    alignSelf: 'center',
    padding: '6px 0'
  },
  name: {
    extend: [fonts.normal, utils.ellipsis],
    lineHeight: 1.2
  },
  info: {
    extend: [fonts.small, utils.ellipsis],
    marginTop: 4,
    opacity: 0.5
  },
  metaContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: '6px 12px'
  },
  metaItem: {
    extend: metaItem
  },
  metaItemFocused: {
    extend: metaItem,
    color: colors.white,
    backgroundColor: Color(colors.grapeLight).lighten(.2).rgbaString(),
    borderColor: Color(colors.grapeLight).lighten(.4).rgbaString()
  }
}
