import merge from 'lodash/object/merge'
import {blueLight, grayBlueLighter, yellow} from 'grape-theme/dist/base-colors'
import sizes from 'grape-theme/dist/sizes'

import useTheme from '../../../theme/useTheme'
import {Bubble} from '../../../message-parts'
import createInlineIcon from '../../../inline-icon/create'
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

export const PinnedBubble = useTheme(Bubble, {
  styles: ({palette}) => merge(baseStyles({color: palette.orange[50]}), {
    bubble: {
      '&::after': {
        extend: createInlineIcon('pinFilled', {color: palette.orange[800], size: sizes.icon.xs})['&:before'],
        position: 'absolute',
        right: -sizes.spacer.l + (sizes.icon.xs / 2),
        top: 0
      }
    }
  })
})
