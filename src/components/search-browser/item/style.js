import colors from 'grape-theme/dist/base-colors'
import webColors from 'grape-theme/dist/web-colors'
import fonts from 'grape-theme/dist/fonts'
import sizes from 'grape-theme/dist/sizes'
import utils from 'grape-jss-utils'

export const container = {
  display: 'flex',
  position: 'relative',
  background: colors.white,
  color: colors.grapeTypo,
  cursor: 'pointer',
  userSelect: 'none',
  borderBottom: '1px solid ' + colors.silverDark
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

const iconSize = 30

export const rules = {
  container: container,
  containerFocused: {
    ...container,
    color: colors.white,
    background: webColors.buttonBgDefault
  },
  containerFocusedInactive: {
    ...container,
    color: colors.grayDark,
    background: colors.grayBlueLight
  },
  iconContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '6px 16px'
  },
  icon: {
    height: iconSize,
    width: iconSize,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    alignSelf: 'center'
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
    ...fonts.smaller,
    ...utils.ellipsis,
    color: colors.grayLight,
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
    backgroundColor: webColors.buttonBgDefault
  }
}
