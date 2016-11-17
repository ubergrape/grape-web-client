import {borderDefault, chatBackground} from 'grape-theme/dist/web-colors'
import {small} from 'grape-theme/dist/fonts'

export const styles = {
  footer: {
    position: 'relative',
    margin: '0 20px',
    borderTop: `1px solid ${borderDefault}`
  },
  markdownTips: {
    backgroundColor: chatBackground,
    bottom: '100%',
    fontSize: small.fontSize,
    marginBottom: 4,
    padding: [[3, 10]],
    position: 'absolute',
    right: -10
  }
}
