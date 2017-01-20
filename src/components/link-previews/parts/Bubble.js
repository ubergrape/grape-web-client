import {white} from 'grape-theme/dist/base-colors'
import {borderDefault} from 'grape-theme/dist/web-colors'

import useTheme from '../../theme/useTheme'
import {Bubble, bubbleBorderRadius} from '../../message-parts'

export default useTheme(Bubble, {
  styles: {
    bubble: {
      backgroundColor: white,
      border: {
        width: 1,
        style: 'solid',
        color: borderDefault,
        radius: bubbleBorderRadius
      },
      maxWidth: 620,
      boxShadow: [-3, 0, 0, 0, '#e6e6e6']
    },
    content: {
      display: 'flex',
      backgroundColor: white,
      padding: [5, 10]
    }
  }
})
