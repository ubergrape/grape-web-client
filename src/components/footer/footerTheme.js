import {borderDefault, chatBackground} from 'grape-theme/dist/web-colors'
import {small} from 'grape-theme/dist/fonts'
import {padding as buttonPadding} from './controlsTheme'

export const styles = {
  footer: {
    position: 'relative',
    margin: '0 20px',
    borderTop: {
      width: 1,
      style: 'solid',
      color: borderDefault
    }
  },
  markdownTips: {
    backgroundColor: chatBackground,
    bottom: '100%',
    fontSize: small.fontSize,
    marginBottom: 4,
    padding: [3, 10],
    position: 'absolute',
    right: -10
  },
  inputWithControls: {
    display: 'flex',
    alignItems: 'center',
    '&:last-child': {
      marginRight: -buttonPadding
    }
  }
}
