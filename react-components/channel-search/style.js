import button from '../button/style'
import fonts from 'grape-theme/dist/fonts'
import sizes from 'grape-theme/dist/sizes'
import colors from 'grape-theme/dist/base-colors'

const ICON_HEIGHT = 30

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
    padding: '5px',
  },
  itemFocused: {
    background: '#EBEEF3'
  },
  itemRoomIcon: {
    width: ICON_HEIGHT,
    height: ICON_HEIGHT,
    borderRadius: sizes.borderRadius.small,
    color: colors.white,
    lineHeight: `${ICON_HEIGHT}px`,
    textAlign: 'center'
  },
  itemUserIcon: {
    width: ICON_HEIGHT,
    height: ICON_HEIGHT,
    borderRadius: '50%',
    background: 'no-repeat center',
    backgroundSize: '100%'
  },
  itemText: {
    paddingLeft: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
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
