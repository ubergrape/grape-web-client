import colors from 'grape-theme/base-colors'
import fonts from 'grape-theme/fonts'

let header = {
  background: 'center no-repeat',
  backgroundSize: 'auto 80%'
}

let body = {
  padding: 10
}

export default {
  info: {
    height: '100%',
    overflow: 'auto',
    '& h2': {
      extend: fonts.normal,
      marginTop: 0
    },
    '& p': {
      extend: fonts.normal
    }
  },
  headerOk: {
    extend: header,
    backgroundColor: colors.grassLighter
  },
  bodyOk: {
    extend: body,
    background: colors.grassLightest
  },
  headerNok: {
    extend: header,
    backgroundColor: colors.sandLight
  },
  bodyNok: {
    extend: body,
    background: colors.sandLighter
  },
  button: {
    width: '100%'
  }
}
