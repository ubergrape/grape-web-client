import colors from 'grape-theme/dist/base-colors'
import webColors from 'grape-theme/dist/web-colors'
import fonts from 'grape-theme/dist/fonts'
import sizes from 'grape-theme/dist/sizes'
import mixins from 'grape-web/lib/jss-utils/mixins'

export const container = {
  display: 'flex',
  position: 'relative',
  background: colors.white,
  color: colors.grayDark,
  cursor: 'pointer',
  userSelect: 'none',
  borderBottom: '1px solid ' + colors.silverDark
}

const info = {
  extend: [
    fonts.smaller,
    mixins.ellipsis
  ],
  marginTop: 4
}

const metaItem = {
  ...fonts.small,
  display: 'block',
  marginLeft: 4,
  padding: '2px 6px',
  borderRadius: sizes.borderRadius.small,
  border: `1px solid ${colors.silverDark}`,
  backgroundColor: colors.silverLight,
  color: colors.gainsboroDark
}

export const rules = {
  container: container,
  containerFocused: {
    ...container,
    color: colors.white,
    background: webColors.buttonBgDefault
  },
  containerFocusedInactive: {
    ...container,
    color: colors.grayDarker,
    background: colors.grayBlueLight
  },
  iconContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '6px 16px',
    fontSize: '1.9em'
  },
  nameContainer: {
    flex: 1,
    alignSelf: 'center',
    padding: '6px 0',
    minWidth: 1 // firefox 34+ flexbox bug workaround
  },
  name: {
    ...fonts.normal,
    ...mixins.ellipsis,
    lineHeight: 1.2
  },
  info: {
    extend: [info],
    color: colors.grayLight
  },
  infoFocused: info,
  metaContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: '6px 12px'
  },
  metaItem: metaItem,
  metaItemFocused: {
    ...metaItem,
    color: colors.white,
    backgroundColor: webColors.buttonBgDefault
  }
}
