import {blueLight, grayBlueLighter, yellow} from 'grape-theme/dist/base-colors'

import useTheme from '../../../theme/useTheme'
import {Bubble} from '../../../message-parts'
import {styles as baseStyles} from '../bubbleTheme'

export const OwnBubble = useTheme(Bubble, {
  styles: baseStyles({color: blueLight})
})

export const MateBubble = useTheme(Bubble, {
  styles: baseStyles({color: grayBlueLighter})
})

export const SelectedBubble = useTheme(Bubble, {
  styles: baseStyles({color: yellow})
})
