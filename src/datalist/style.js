import colors from 'grape-theme/dist/base-colors'
import fonts from 'grape-theme/dist/fonts'
import utils from 'grape-jss-utils'
import color from 'color'

let item = {
  padding: '5px 7px',
  color: colors.grapeTypo,
  cursor: 'pointer'
}

export default {
  container: {
    background: colors.white,
    border: '1px solid ' + colors.gainsboroLight,
    boxShadow: '0px 3px 4px 0 ' + color(colors.grapeTypo).alpha(0.5).rgbaString(),
    overflow: 'auto'
  },
  item: {
    ...item,
    ...utils.ellipsis,
    ...fonts.normal
  },
  itemFocused: {
    ...item,
    ...utils.ellipsis,
    ...fonts.normal,
    color: colors.white,
    background: colors.grapeLight
  },
  icon: {
    display: 'inline-block',
    lineHeight: 0,
    verticalAlign: 'middle',
    marginTop: -3
  },
  name: {
    lineHeight: 1,
    marginLeft: 5
  }
}
