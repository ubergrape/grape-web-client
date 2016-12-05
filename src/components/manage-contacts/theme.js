import {grayBlue} from 'grape-theme/dist/base-colors'
import {normal} from 'grape-theme/dist/fonts'

export const styles = {
  container: {
    extend: normal,
    height: 356,
    padding: [10, 0],
    overflowY: 'auto'
  },
  message: {
    extend: normal,
    color: grayBlue,
    padding: [0, 20, 10]
  }
}
