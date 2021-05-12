import colors from 'grape-theme/dist/base-colors'
import webColors from 'grape-theme/dist/web-colors'
import fonts from 'grape-theme/dist/fonts'
import sizes from 'grape-theme/dist/sizes'
import mixins from 'grape-web/lib/jss-utils/mixins'

export const rules = {
  container: {
    display: 'flex',
    position: 'relative',
    background: colors.white,
    color: colors.grayDark,
    userSelect: 'none',
    borderBottom: [1, 'solid', colors.silverDark],
    '&, & *': {
      isolate: false,
      cursor: 'pointer',
    },
  },
  containerFocused: {
    composes: '$container',
    color: colors.white,
    background: webColors.buttonBgDefault,
  },
  containerFocusedInactive: {
    composes: '$container',
    color: colors.grayDarker,
    background: colors.grayBlueLight,
  },
  iconContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: [6, 16],
    fontSize: '1.9em',
  },
  nameContainer: {
    flex: 1,
    alignSelf: 'center',
    padding: [6, 0],
    minWidth: 1, // firefox 34+ flexbox bug workaround
    color: 'inherit',
  },
  name: {
    extend: [fonts.normal, mixins.ellipsis],
    lineHeight: 1.2,
    color: 'inherit',
  },
  info: {
    extend: [fonts.smaller, mixins.ellipsis],
    marginTop: 4,
    color: colors.grayLight,
  },
  infoFocused: {
    composes: '$info',
    color: 'inherit',
  },
  metaContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: [6, 12],
  },
  metaItem: {
    extend: fonts.small,
    display: 'block',
    marginLeft: 4,
    padding: [2, 6],
    borderRadius: sizes.borderRadius.small,
    border: [1, 'solid', colors.silverDark],
    backgroundColor: colors.silverLight,
    color: colors.gainsboroDark,
  },
  metaItemFocused: {
    composes: '$metaItem',
    color: colors.white,
    backgroundColor: webColors.buttonBgDefault,
  },
}
