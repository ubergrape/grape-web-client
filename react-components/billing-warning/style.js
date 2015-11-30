import fonts from 'grape-theme/dist/fonts'
import defaultButton from '../button/default'
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
    ...primaryButton,
    marginRight: 20
  },
  enterDetails: {
    ...defaultButton,
  }
}
