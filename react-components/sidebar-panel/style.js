import color from 'color'
import colors from 'grape-theme/dist/base-colors'
import fonts from 'grape-theme/dist/fonts'
import utils from 'grape-jss-utils'

import buttonIcon from '../button/icon'

const padding = 20

export default {
  sidebarPanel: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    background: colors.grayBlueLight
  },
  header: {
    display: 'flex',
    flexShrink: 0,
    background: colors.grayBlueDark,
    // Used to overlap absolutely positioned content e.g. loading indicator.
    position: 'relative',
    zIndex: 1
  },
  title: {
    ...fonts.bigger,
    ...utils.ellipsis,
    flex: 2,
    alignSelf: 'center',
    color: colors.gray,
    padding: `14px ${padding}px`
  },
  body: {
    padding: 20,
    background: colors.grayBlueLight,
    overflow: 'auto'
  },
  close: {
    ...buttonIcon('close', {color: colors.grayBlue, hoverColor: color(colors.blue).lighten(0.05).rgbaString(), iconOnly: true}),
    padding: `0 ${padding}px`
  }
}
