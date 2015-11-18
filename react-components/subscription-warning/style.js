import fonts from 'grape-theme/dist/fonts'
import defaultButton from '../button/style'
import primaryButton from '../button/primary'

export default {
  content: {
    padding: 15
  },
  text: {
    ...fonts.big,
    textAlign: 'center',
    padding: '50px 0'
  },
  actions: {
    textAlign: 'right'
  },
  continueTrial: {
    ...defaultButton,
    marginRight: 20
  },
  enterDetails: {
    ...primaryButton
  }
}
