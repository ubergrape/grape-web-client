import color from 'color'
import utils from 'grape-jss-utils'
import fonts from 'grape-theme/dist/fonts'
import colors from 'grape-theme/dist/base-colors'
import webColors from 'grape-theme/dist/web-colors'

import buttonIcon from '../button/icon'

const padding = 20

export default {
  sidebarPanel: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    background: colors.grayBlueLighter
  },
  header: {
    display: 'flex',
    flexShrink: 0,
    borderBottom: `1px solid ${webColors.borderDefault}`,
    marginLeft: 20,
    // Used to overlap absolutely positioned content e.g. loading indicator.
    position: 'relative',
    zIndex: 1
  },
  title: {
    ...fonts.big,
    ...utils.ellipsis,
    flex: 2,
    alignSelf: 'center',
    color: colors.gray,
    padding: `14px ${padding}px 14px 0`
  },
  body: {
    padding: 20,
    background: colors.grayBlueLighter,
    overflowY: 'auto',
    overflowX: 'hidden'
  },
  close: {
    ...buttonIcon('close', {color: colors.grayBlue, hoverColor: color(colors.blue).lighten(0.05).rgbaString(), iconOnly: true}),
    padding: `0 ${padding}px`
  }
}
