import fonts from 'grape-theme/dist/fonts'
import colors from 'grape-theme/dist/base-colors'
import getColoredIcon from 'grape-web/lib/svg-icons/getColored'

import {plusIconStyle} from '../constants'

const iconSize = 32
const margin = 15

const magnifierIcon = getColoredIcon({name: 'magnifier', color: colors.grayBlueDark})

export default {
  searchInput: {
    display: 'flex',
    borderBottom: `1px solid ${colors.silverDark}`
  },
  magnifierIcon: {
    flexShrink: 0,
    height: iconSize - 10,
    width: iconSize - 10,
    background: `no-repeat url('${magnifierIcon}')`,
    backgroundSize: 'contain',
    alignSelf: 'center',
    margin
  },
  plusButton: {
    extend: plusIconStyle,
    flexShrink: 0,
    height: iconSize,
    width: iconSize,
    alignSelf: 'center',
    margin,
    cursor: 'pointer'
  },
  container: {
    flex: 1,
    border: '1px solid transparent'
  },
  editable: {
    ...fonts.biggest,
    paddingTop: margin,
    paddingBottom: margin,
    height: 31 + margin * 2,
    border: '1px solid transparent',
    outline: 'none'
  },
  highlighter: {
    extend: 'editable',
    whiteSpace: 'pre'
  },
  token: {
    background: 'linear-gradient(0deg, #b8e7aa, #c3ebb7)'
  }
}
