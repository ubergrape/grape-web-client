import { biggest } from 'grape-theme/dist/fonts'
import { grayBlueDark, silverDark } from 'grape-theme/dist/base-colors'
import getColoredIcon from 'grape-web/lib/svg-icons/getColored'

import { plusIconStyle } from '../constants'

const iconSize = 32
const margin = 15

const magnifierIcon = getColoredIcon({ name: 'magnifier', color: grayBlueDark })

export default {
  searchInput: {
    display: 'flex',
    borderBottom: [1, 'solid', silverDark],
    flexShrink: 0,
  },
  magnifierIcon: {
    flexShrink: 0,
    height: iconSize - 10,
    width: iconSize - 10,
    background: `no-repeat url('${magnifierIcon}')`,
    backgroundSize: 'contain',
    alignSelf: 'center',
    margin,
  },
  plusButton: {
    extend: plusIconStyle,
    flexShrink: 0,
    height: iconSize,
    width: iconSize,
    alignSelf: 'center',
    margin,
    cursor: 'pointer',
  },
  container: {
    flex: 1,
    border: [1, 'solid', 'transparent'],
  },
  editable: {
    extend: biggest,
    paddingTop: margin,
    paddingBottom: margin,
    height: 31 + margin * 2,
    border: [1, 'solid', 'transparent'],
    outline: 'none',
    whiteSpace: 'pre',
    '&::-ms-clear': {
      isolate: false,
      display: 'none',
    },
  },
  highlighter: {
    composes: '$editable',
  },
  token: {
    extend: biggest,
    background: 'linear-gradient(0deg, #b8e7aa, #c3ebb7)',
    whiteSpace: 'pre',
  },
}
