import { big, normal } from 'grape-theme/dist/fonts'
import { spacer } from 'grape-theme/dist/sizes'

export default {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    padding: [80, 20],
  },
  title: {
    extend: big,
    fontWeight: 600,
  },
  description: {
    extend: normal,
    marginTop: spacer.xs,
  },
}
