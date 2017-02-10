import {grayBlueLighter} from 'grape-theme/dist/base-colors'

import button from '../../../button/link'
import {bubbleBorderRadius as borderRadius} from '../../../message-parts'

export const maxHeight = 350

export const color = grayBlueLighter

const panel = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  textAlign: 'center',
  borderRadius
}

export const styles = {
  expandedExpander: {
    paddingBottom: 15
  },
  collapsedExpander: {
    overflow: 'hidden',
    maxHeight
  },
  collapsedPanel: {
    extend: panel,
    paddingTop: 50,
    background: `linear-gradient(to bottom, rgba(237, 240, 245, 0) 0%, ${color} 70%)`,
    fallbacks: {
      background: color
    }
  },
  expandedPanel: panel,
  button
}
