import {borderDefault} from 'grape-theme/dist/web-colors'
import {red} from 'grape-theme/dist/base-colors'

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
    padding: [20, 0]
  },
  deleteButton: {
    // FIXME once https://github.com/callemall/material-ui/issues/6227 is soved
    padding: '12px 16px !important'
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end'
  }
}
