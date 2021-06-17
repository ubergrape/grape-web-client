import { yellow } from 'grape-theme/dist/base-colors'

import useTheme from '../../../theme/useTheme'
import { Bubble } from '../../../message-parts'
import { styles as baseStyles } from '../bubbleTheme'
import { expanderColor } from './constants'

// Should import server configuration here, because after wrapping e.g MateBubble,
// bubble with buttons (delete, pin, etc.) will not load.
import conf from '../../../../conf'

export const ActivityBubble = useTheme(Bubble, {
  styles: baseStyles({
    backgroundColor:
      (conf.organization.colors && conf.organization.colors.mateMessage) ||
      expanderColor,
  }),
})

export const SelectedBubble = useTheme(Bubble, {
  styles: baseStyles({ backgroundColor: yellow }),
})
