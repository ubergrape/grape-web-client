import fonts from 'grape-theme/dist/fonts'

import defaultButton from '../button/default'
import primaryButton from '../button/primary'

export const styles = {
  content: {
    padding: 15,
    width: 525,
  },
  text: {
    extend: fonts.big,
    textAlign: 'center',
    padding: '50px 0',
  },
  actions: {
    textAlign: 'right',
  },
  continueTrial: {
    extend: primaryButton,
    marginRight: 20,
  },
  enterDetails: defaultButton,
}
