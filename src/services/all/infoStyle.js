import colors from 'grape-theme/base-colors'
import fonts from 'grape-theme/fonts'

let info = {
  height: '100%',
  overflow: 'auto',
  '& h2': {
    extend: fonts.normal,
    marginTop: 0
  },
  '& p': {
    extend: fonts.normal
  }
}

let header = {
  background: 'center no-repeat',
  backgroundSize: 'auto 80%'
}

export default {
  infoOk: {
    extend: info,
    background: colors.grassLightest
  },
  infoNok: {
    extend: info,
    background: colors.sandLight
  },
  headerOk: {
    extend: header,
    backgroundColor: colors.grassLighter
  },
  headerNok: {
    extend: header,
    backgroundColor: colors.sandLight
  },
  body: {
    padding: 10
  },
  button: {
    width: '100%'
  }
}
