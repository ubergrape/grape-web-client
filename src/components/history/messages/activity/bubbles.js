import { yellow } from 'grape-theme/dist/base-colors'

import useTheme from '../../../theme/useTheme'
import { Bubble } from '../../../message-parts'
import { styles as baseStyles } from '../bubbleTheme'
import { expanderColor } from './constants'

export const ActivityBubble = useTheme(Bubble, {
  styles: baseStyles({ color: expanderColor }),
})

export const SelectedBubble = useTheme(Bubble, {
  styles: baseStyles({ color: yellow }),
})
