import merge from 'lodash/merge'
import {
  blueLight,
  grayBlueLighter,
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

export const OwnBubble = useTheme(Bubble, {
  styles: baseStyles({
    color:
      (conf.organization.colors && conf.organization.colors.ownMessage) ||
      blueLight,
  }),
})

const MateBubble = useTheme(Bubble, {
  styles: baseStyles({
    color:
      (conf.organization.colors && conf.organization.colors.mateMessage) ||
      grayBlueLighter,
  }),
})

const SelectedBubble = useTheme(Bubble, {
  styles: baseStyles({ color: yellow }),
})

const pinnedStyles = ({ backgroundColor, pinColor }) =>
  merge(baseStyles({ color: backgroundColor }), {
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

const PinnedBubble = useTheme(Bubble, {
  styles: ({ palette }) =>
    pinnedStyles({
      backgroundColor: palette.orange[50],
      pinColor: palette.orange[800],
    }),
})

const PinnedSelectedBubble = useTheme(Bubble, {
  styles: ({ palette }) =>
    pinnedStyles({
      backgroundColor: yellow,
      pinColor: palette.orange[800],
    }),
})

export default ({ isSelected, isPinned, isOwn }) => {
  if (isPinned && isSelected) return PinnedSelectedBubble
  if (isPinned) return PinnedBubble
  if (isSelected) return SelectedBubble
  if (isOwn) return OwnBubble
  return MateBubble
}
