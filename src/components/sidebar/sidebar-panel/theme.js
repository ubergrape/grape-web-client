import color from 'color'
import {ellipsis} from 'grape-web/lib/jss-utils/mixins'
import {small, big} from 'grape-theme/dist/fonts'
import colors from 'grape-theme/dist/base-colors'
import webColors from 'grape-theme/dist/web-colors'
import {zIndex} from '../../../utils/z-index'

import buttonIcon from '../../button/icon'

const spacing = 20

const title = {
  extend: [big, ellipsis],
  flex: 2,
  alignSelf: 'center',
  color: colors.gray,
  padding: [14, spacing, 14, 0],
  margin: 0
}

const commonHeader = {
  display: 'flex',
  flexShrink: 0,
  borderBottom: [1, 'solid', webColors.borderDefault],
  // Used to overlap absolutely positioned content e.g. loading indicator.
  position: 'relative',
  zIndex: zIndex('base')
}

export const styles = {
  sidebarPanel: {
    alignItems: 'stretch',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    background: colors.grayBlueLighter,
    height: '100%'
  },
  header: {
    ...commonHeader,
    marginLeft: spacing
  },
  headerOptions: commonHeader,
  title,
  titleOptions: {
    ...title,
    paddingLeft: spacing
  },
  body: {
    background: colors.grayBlueLighter,
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden'
  },
  close: {
    extend: [
      small,
      buttonIcon('close', {
        color: colors.grayBlue,
        hoverColor: color(colors.blue).lighten(0.05).rgbaString(),
        iconOnly: true
      })
    ],
    padding: [0, spacing],
    background: 'none'
  }
}
