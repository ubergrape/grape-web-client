import { borderDefault } from 'grape-theme/dist/web-colors'

import buttonPrimary from '../button/primary'

export const styles = {
  createButton: {
    extend: buttonPrimary,
    '&:disabled': {
      isolate: false,
      opacity: 0.5,
      pointerEvents: 'none',
    },
  },
  advancedSettings: {
    display: 'block',
    padding: [15, 0],
    marginTop: 15,
    borderTop: [1, 'solid', borderDefault],
  },
  footer: {
    display: 'block',
    paddingTop: 15,
    borderTop: [1, 'solid', borderDefault],
    textAlign: 'right',
  },
}
