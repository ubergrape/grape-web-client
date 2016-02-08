import fonts from 'grape-theme/dist/fonts'
import colors from 'grape-theme/dist/base-colors'
import getColoredIcon from 'grape-web/lib/svg-icons/getColored'

import style from '../browser/style'

const iconSize = 22
const editablePadding = 15
const magnifierIcon = getColoredIcon({name: 'magnifier', color: colors.blue})

export default {
  ...style,
  editableContainer: {
    display: 'flex'
  },
  searchIcon: {
    flexShrink: 0,
    height: iconSize,
    width: iconSize,
    background: `no-repeat url('${magnifierIcon}')`,
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
    display: 'block',
    paddingTop: editablePadding,
    paddingBottom: editablePadding,
    minHeight: 31,
    border: 'none !important',
    outline: 'none',
    width: '100%'
  },
  highlighter: {
    extend: 'editable'
  }
}
