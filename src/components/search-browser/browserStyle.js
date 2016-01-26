import fonts from 'grape-theme/dist/fonts'
import colors from 'grape-theme/dist/base-colors'
import getColoredIcon from 'grape-web/lib/svg-icons/getColored'

import style from '../browser/style'

const iconSize = 22
const magnifierIcon = getColoredIcon({name: 'magnifier', color: colors.blue})

export default {
  ...style,
  input: {
    ...fonts.biggest,
    color: colors.grapeTypo,
    padding: 15,
    border: 'none !important',
    outline: 'none',
    flex: 1
  },
  inputContainer: {
    display: 'flex'
  },
  searchIcon: {
    height: iconSize,
    width: iconSize,
    background: `no-repeat url('${magnifierIcon}')`,
    backgroundSize: 'contain',
    alignSelf: 'center',
    marginLeft: 20
  }
}
