import buttonPrimary from '../button/primary'
import {borderDefault} from 'grape-theme/dist/web-colors'

export const styles = {
  createButton: {
    extend: buttonPrimary,
    '&:disabled': {
      isolate: false,
      opacity: 0.5,
      pointerEvents: 'none'
    }
  },
  advancedSettings: {
    padding: [15, 0],
    marginTop: 15,
    borderTop: [1, 'solid', borderDefault]
  },
  footer: {
    paddingTop: 15,
    borderTop: [1, 'solid', borderDefault],
    textAlign: 'right'
  }
}
