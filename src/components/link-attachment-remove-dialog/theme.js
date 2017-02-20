import {grayMercury} from 'grape-theme/dist/base-colors'
import buttonDanger from '../button/danger'
import buttonDefault from '../button/default'

export const styles = {
  adminField: {
    border: 0,
    padding: 0,
    paddingLeft: 20,
    margin: 0,
    marginTop: 10
  },
  wrapper: {
    padding: [0, 20, 20]
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    userSelect: 'none',
    cursor: 'default',
    '& > input': {
      marginRight: 3
    }
  },
  select: {
    display: 'block',
    width: '100%',
    marginTop: 5,
    backgroundColor: 'transparent',
    '&:disabled': {
      backgroundColor: grayMercury
    }
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 20
  },
  submitButton: {
    extend: buttonDanger,
    marginLeft: 5
  },
  cancelButton: buttonDefault
}
