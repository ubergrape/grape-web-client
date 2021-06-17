import { grayBlueLighter } from 'grape-theme/dist/base-colors'
import { small } from 'grape-theme/dist/fonts'

import defaultButton from '../button/default'
import dangerButton from '../button/danger'

export default () => ({
  content: {
    borderTop: [3, 'solid', grayBlueLighter],
  },
  text: {
    extend: small,
    margin: [27, 20, 0],
  },
  textBold: {
    extend: small,
    fontWeight: 'bold',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    textAlign: 'right',
    margin: 20,
  },
  cancelButton: {
    extend: defaultButton,
    marginRight: 10,
  },
  leaveButton: {
    extend: dangerButton,
  },
})
