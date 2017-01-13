import {white} from 'grape-theme/dist/base-colors'
import {borderDefault} from 'grape-theme/dist/web-colors'

import useTheme from '../../theme/useTheme'
import Bubble from '../../message-parts/Bubble'

export default useTheme(Bubble, {
  styles: {
    bubble: {
      backgroundColor: white,
      border: {
        width: 1,
        style: 'solid',
        color: borderDefault,
        radius: 16
      },
      display: 'block'
    },
    content: {
      backgroundColor: white
    }
  }
})
