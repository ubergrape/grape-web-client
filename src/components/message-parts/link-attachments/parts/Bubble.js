import { grayMercury, white } from 'grape-theme/dist/base-colors'
import { borderDefault } from 'grape-theme/dist/web-colors'

import useTheme from '../../../theme/useTheme'
import Bubble from '../../Bubble'
import { borderRadius } from '../../bubbleTheme'

export default useTheme(Bubble, {
  styles: {
    bubble: {
      backgroundColor: white,
      border: {
        width: 1,
        style: 'solid',
        color: borderDefault,
        radius: borderRadius,
      },
      maxWidth: 620,
      boxShadow: [-3, 0, 0, 0, grayMercury],
      width: '100%',
    },
    content: {
      display: 'flex',
      backgroundColor: white,
      padding: [5, 10],
    },
  },
})
