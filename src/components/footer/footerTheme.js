import {yellow} from 'grape-theme/dist/base-colors'
import {borderDefault, chatBackground} from 'grape-theme/dist/web-colors'
import spacers from 'grape-theme/dist/spacers'
import scrollbarSize from 'scrollbar-size'
import {padding as buttonPadding} from './controlsTheme'

const aboveHintsPadding = 3

export const styles = {
  footer: {
    position: 'relative',
    padding: [0, spacers.l],
    borderTop: {
      width: 1,
      style: 'solid',
      color: borderDefault
    }
  },
  above: {
    position: 'absolute',
    bottom: '100%',
    // On windows scrollbar is always visible.
    right: scrollbarSize,
    left: 0,
    padding: [aboveHintsPadding, spacers.l],
    display: 'flex'
  },
  typingNotificationContainer: {
    flex: 1,
    overflow: 'hidden'
  },
  typingNotification: {
    background: chatBackground,
    padding: aboveHintsPadding,
    paddingLeft: 0
  },
  markdownTipsLink: {
    flex: 0,
    flexBasis: 'auto',
    background: chatBackground,
    whiteSpace: 'nowrap',
    padding: aboveHintsPadding,
    paddingRight: 0
  },
  inputWithControls: {
    display: 'flex',
    alignItems: 'center',
    '&:last-child': {
      marginRight: -buttonPadding
    }
  },
  highlighted: {
    backgroundColor: yellow
  }
}
