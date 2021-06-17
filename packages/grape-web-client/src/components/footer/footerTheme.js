import { yellow, grayLightest, white } from 'grape-theme/dist/base-colors'
import {
  borderDefault,
  borderLighter,
  chatBackground,
} from 'grape-theme/dist/web-colors'
import { spacer } from 'grape-theme/dist/sizes'
import scrollbarSize from 'scrollbar-size'

import { controlSpacing } from './constants'

const aboveHintsPadding = 3

export const styles = {
  footer: {
    position: 'relative',
    padding: [0, spacer.l],
    background: ({ disabled }) => (disabled ? grayLightest : white),
    borderTop: {
      width: 1,
      style: 'solid',
    },
    borderColor: ({ disabled }) => (disabled ? borderLighter : borderDefault),
  },
  above: {
    position: 'absolute',
    bottom: '100%',
    // On windows scrollbar is always visible.
    right: scrollbarSize,
    left: 0,
    padding: [aboveHintsPadding, spacer.l],
    display: 'flex',
  },
  typingNotificationContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  typingNotification: {
    background: chatBackground,
    padding: aboveHintsPadding,
    paddingLeft: 0,
  },
  markdownTipsLink: {
    flex: 0,
    flexBasis: 'auto',
    background: chatBackground,
    whiteSpace: 'nowrap',
    padding: aboveHintsPadding,
    paddingRight: 0,
  },
  inputWithControls: {
    display: 'flex',
    alignItems: 'center',
    '&:last-child': {
      isolate: false,
      marginRight: -controlSpacing,
    },
  },
  highlighted: {
    backgroundColor: yellow,
  },
}
