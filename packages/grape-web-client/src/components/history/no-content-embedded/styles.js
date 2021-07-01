import { big, normal } from 'grape-theme/dist/fonts'
import { spacer } from 'grape-theme/dist/sizes'

export default {
  noContentEmbedded: {
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: [0, 40],
  },
  icon: {
    height: 53,
    width: 59,
    color: '#727272',
  },
  title: {
    extend: big,
    marginTop: spacer.m,
    textAlign: 'center',
    fontWeight: 600,
  },
  description: {
    extend: normal,
    textAlign: 'center',
    marginTop: spacer.xs,
  },
}
