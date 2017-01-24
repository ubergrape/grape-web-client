import {bigger} from 'grape-theme/dist/fonts'
import {grayBlueLighter} from 'grape-theme/dist/base-colors'
import color from 'color'

export const styles = {
  advancedSettings: {
    display: 'flex',
    position: 'relative',
    alignItems: 'center'
  },
  icon: {
    flexShrink: 1
  },
  name: {
    flexGrow: 1,
    marginRight: 10
  },
  nameInput: {
    extend: bigger,
    width: '100%',
    outline: 'none',
    padding: '1px 10px',
    borderRadius: 5,
    border: [1, 'solid', color(grayBlueLighter).darken(0.05).hexString()]
  }
}
