import colors from 'grape-theme/base-colors'
import fonts from 'grape-theme/fonts'

let body = {
  padding: 10
}

export default {
  info: {
    height: '100%',
    overflow: 'auto',
    '& h2': {
      extend: fonts.big,
      marginTop: 0
    },
    '& p': {
      extend: fonts.normal
    }
  },
  headerOk: {
    background: colors.grassLighter
  },
  bodyOk: {
    extend: body,
    background: colors.grassLightest
  },
  headerNok: {
    background: colors.sandLight
  },
  bodyNok: {
    extend: body,
    background: colors.sandLighter
  }
}
