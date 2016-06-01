import useTheme from '../../theme/useTheme'
import Bubble from '../../message-parts/Bubble'
import {styles as baseStyles} from './bubbleTheme'

// FIXME use grape-theme
let color = '#edf0f5'
let styles = baseStyles({color})

export const OwnBubble = useTheme(Bubble, {styles})

// FIXME use grape-theme
color = '#d2e6fb'
styles = baseStyles({color})

export const MateBubble = useTheme(Bubble, {styles})
