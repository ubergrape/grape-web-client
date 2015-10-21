import button from '../button/style'
import fonts from 'grape-theme/dist/fonts'
import sizes from 'grape-theme/dist/sizes'
import colors from 'grape-theme/dist/base-colors'
import utils from 'grape-jss-utils'

const ICON_HEIGHT = 30

let icon = {
  flexShrink: 0,
  width: ICON_HEIGHT,
  height: ICON_HEIGHT
}

export default {
  content: {
    padding: 15,
    height: 300,
    display: 'flex',
    flexDirection: 'column'
  },
  input: {
    width: '100%'
  },
  list: {
    margin: '5px 0'
  },
  item: {
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5
  },
  itemFocused: {
    background: colors.grayBlueLight
  },
  itemRoomIcon: {
    ...icon,
    borderRadius: sizes.borderRadius.small,
    color: colors.white,
    lineHeight: `${ICON_HEIGHT}px`,
    textAlign: 'center'
  },
  itemUserIcon: {
    ...icon,
    borderRadius: '50%',
    background: 'no-repeat center',
    backgroundSize: '100%'
  },
  itemText: {
    ...utils.ellipsis,
    paddingLeft: 10
  },
  fallback: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  },
  fallbackHeadline: {
    ...fonts.normal,
    marginBottom: 20
  },
  button: button
}
