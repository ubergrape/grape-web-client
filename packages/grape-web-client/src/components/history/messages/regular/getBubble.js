import merge from 'lodash/merge'
import {
  blueLighter,
  grayBlueLighter,
  white,
  yellow,
} from 'grape-theme/dist/base-colors'
import sizes from 'grape-theme/dist/sizes'

import useTheme from '../../../theme/useTheme'
import { Bubble } from '../../../message-parts'
import createInlineIcon from '../../../inline-icon/create'
import { styles as baseStyles } from '../bubbleTheme'

// Should import server configuration here, because after wrapping e.g MateBubble,
// bubble with buttons (delete, pin, etc.) will not load.
import conf from '../../../../conf'

const pinnedStyles = ({ backgroundColor, pinColor }) =>
  merge(baseStyles({ backgroundColor }), {
    bubble: {
      '&::after': {
        extend: createInlineIcon('pinFilled', {
          color: pinColor,
          size: sizes.icon.xs,
        })['&:before'],
        position: 'absolute',
        right: -sizes.spacer.l + sizes.icon.xs / 2,
        top: 0,
      },
    },
  })

const UnsentBubble = useTheme(Bubble, {
  styles: baseStyles({ backgroundColor: white, borderColor: grayBlueLighter }),
})

const PinnedSelectedBubble = useTheme(Bubble, {
  styles: ({ palette }) =>
    pinnedStyles({
      backgroundColor: yellow,
      pinColor: palette.orange[800],
    }),
})

const PinnedBubble = useTheme(Bubble, {
  styles: ({ palette }) =>
    pinnedStyles({
      backgroundColor: palette.orange[50],
      pinColor: palette.orange[800],
    }),
})

const SelectedBubble = useTheme(Bubble, {
  styles: baseStyles({ backgroundColor: yellow }),
})

export const OwnBubble = useTheme(Bubble, {
  styles: baseStyles({
    backgroundColor:
      (conf.organization.colors && conf.organization.colors.ownMessage) ||
      blueLighter,
  }),
})

const MateBubble = useTheme(Bubble, {
  styles: baseStyles({
    backgroundColor:
      (conf.organization.colors && conf.organization.colors.mateMessage) ||
      grayBlueLighter,
  }),
})

export default ({ isSelected, isPinned, isOwn, state }) => {
  if (state === 'unsent') return UnsentBubble
  if (isPinned && isSelected) return PinnedSelectedBubble
  if (isPinned) return PinnedBubble
  if (isSelected) return SelectedBubble
  if (isOwn) return OwnBubble
  return MateBubble
}
