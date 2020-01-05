import { grayMercury, white } from 'grape-theme/dist/base-colors'
import { borderDefault } from 'grape-theme/dist/web-colors'

import useTheme from '../../../theme/useTheme'
import Bubble from '../../Bubble'
import { borderRadius } from '../../bubbleTheme'

export default useTheme(Bubble, {
  styles: {
    bubble: ({ color }) => ({
      backgroundColor: white,
      border: `1px solid ${borderDefault}`,
      borderRadius: `${borderRadius}px`,
      maxWidth: 620,
      boxShadow: `-3px 0px 0px 0px ${color || grayMercury}`,
    }),
    content: {
      backgroundColor: white,
      padding: [5, 10],
    },
  },
})
