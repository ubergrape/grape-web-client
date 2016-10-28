import {blueLight, grayBlueLighter, yellow} from 'grape-theme/dist/base-colors'

import useTheme from '../../theme/useTheme'
import Bubble from '../../message-parts/Bubble'
import {styles as baseStyles} from './bubbleTheme'
import {color as expanderColor} from './expanderTheme'

export const OwnBubble = useTheme(Bubble, {
  styles: baseStyles({color: blueLight})
})

export const MateBubble = useTheme(Bubble, {
  styles: baseStyles({color: grayBlueLighter})
})

const styles = baseStyles({color: expanderColor})
export const ActivityBubble = useTheme(Bubble, {
  styles: {
    ...styles,
    content: {
      extend: styles.content,
      overflow: 'hidden'
    }
  }
})

export const SelectedBubble = useTheme(Bubble, {
  styles: baseStyles({color: yellow})
})
