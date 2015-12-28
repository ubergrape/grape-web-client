import colors from 'grape-theme/dist/base-colors'
import fonts from 'grape-theme/dist/fonts'
import utils from 'grape-jss-utils'
import color from 'color'

export default {
  datalist: {
    background: colors.white,
    border: '1px solid ' + colors.gainsboroLight,
    boxShadow: '0px 3px 4px 0 ' + color(colors.grapeTypo).alpha(0.5).rgbaString(),
    overflow: 'auto'
  },
  item: {
    ...fonts.normal,
    ...utils.ellipsis,
    padding: '5px 7px',
    color: colors.grapeTypo,
    cursor: 'pointer'
  },
  itemFocused: {
    color: colors.white,
    background: colors.grapeLight
  },
  icon: {
    minWidth: 22,
    display: 'inline-block',
    lineHeight: 0,
    textAlign: 'center',
    verticalAlign: 'middle',
    marginTop: -3
  },
  name: {
    lineHeight: 1,
    marginLeft: 5
  },
  note: {
    ...fonts.small,
    color: colors.gainsboroDark,
    marginLeft: 6
  },
  noteFocused: {
    color: colors.white
  }
}
