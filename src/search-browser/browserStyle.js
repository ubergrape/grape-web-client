import fonts from 'grape-theme/dist/fonts'
import colors from 'grape-theme/dist/base-colors'
import * as icons from 'grape-web/lib/svg-icons/data'

import style from '../browser/style'

const iconSize = 22

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
    display: 'inline-block',
    height: iconSize,
    width: iconSize,
    background: `no-repeat url('${icons.magnifier}')`,
    backgroundSize: 'contain',
    alignSelf: 'center',
    marginLeft: 20
  }
}
