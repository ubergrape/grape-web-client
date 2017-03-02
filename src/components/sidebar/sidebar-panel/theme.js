import color from 'color'
import {ellipsis} from 'grape-web/lib/jss-utils/mixins'
import {small, big} from 'grape-theme/dist/fonts'
import colors from 'grape-theme/dist/base-colors'
import webColors from 'grape-theme/dist/web-colors'
import {zIndex} from '../../../utils/z-index'

import buttonIcon from '../../button/icon'

const gap = 20

const title = {
  extend: [big, ellipsis],
  flex: 2,
  alignSelf: 'center',
  color: colors.gray,
  padding: `14px ${gap}px 14px 0`
}

const commonHeader = {
  display: 'flex',
  flexShrink: 0,
  borderBottom: `1px solid ${webColors.borderDefault}`,
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
    background: colors.grayBlueLighter
  },
  header: {
    ...commonHeader,
    marginLeft: gap
  },
  headerOptions: commonHeader,
  title,
  titleOptions: {
    ...title,
    paddingLeft: gap
  },
  body: {
    padding: gap,
    background: colors.grayBlueLighter,
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden'
  },
  close: {
    extend: [
      small,
      buttonIcon('close', {color: colors.grayBlue, hoverColor: color(colors.blue).lighten(0.05).rgbaString(), iconOnly: true})
    ],
    padding: `0 ${gap}px`
  }
}
