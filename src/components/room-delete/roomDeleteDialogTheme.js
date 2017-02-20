import {borderDefault} from 'grape-theme/dist/web-colors'
import {red} from 'grape-theme/dist/base-colors'
import {small} from 'grape-theme/dist/fonts'

import deleteButton from '../button/danger'

export const styles = {
  wrapper: {
    padding: 20,
    borderTop: {
      width: 3,
      style: 'solid',
      color: borderDefault
    },
    maxHeight: '80vh',
    overflowY: 'auto'
  },
  messageContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  messageIcon: {
    marginRight: 20,
    height: 40,
    fill: red
  },
  messageWarning: {
    color: red
  },
  inputContainer: {
    padding: [20, 0],
    '& > p': small,
    'input:invalid': {
      borderColor: red
    }
  },
  deleteButton: {
    extend: deleteButton,
    padding: 10
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end'
  }
}
