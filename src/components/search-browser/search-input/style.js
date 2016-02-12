import fonts from 'grape-theme/dist/fonts'
import colors from 'grape-theme/dist/base-colors'
import getColoredIcon from 'grape-web/lib/svg-icons/getColored'

const iconSize = 22
const editablePadding = 15
const icon = getColoredIcon({name: 'magnifier', color: colors.blue})

export default {
  searchInput: {
    display: 'flex',
    borderBottom: `1px solid ${colors.silverDark}`
  },
  icon: {
    flexShrink: 0,
    height: iconSize,
    width: iconSize,
    background: `no-repeat url('${icon}')`,
    backgroundSize: 'contain',
    alignSelf: 'center',
    marginLeft: iconSize
  },
  container: {
    flex: 1,
    marginLeft: editablePadding,
    marginRight: iconSize * 2 + editablePadding
  },
  editable: {
    ...fonts.biggest,
    paddingTop: editablePadding,
    paddingBottom: editablePadding,
    height: 31,
    border: 'none !important',
    outline: 'none'
  },
  highlighter: {
    extend: 'editable',
    marginLeft: 1
  },
  token: {
    background: 'linear-gradient(0deg, #b8e7aa, #c3ebb7)'
  }
}
