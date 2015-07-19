import colors from 'grape-theme/dist/base-colors'
import fonts from 'grape-theme/dist/fonts'

let info = {
  overflow: 'auto',
  '& h2': {
    ...fonts.big,
    margin: 0
  },
  '& p': {
    ...fonts.normal,
    margin: `${fonts.normal.fontSize} 0`
  }
}

let header = {
  background: 'center no-repeat',
  backgroundSize: 'auto 80%'
}

export default {
  infoOk: {
    ...info,
    background: colors.grassLightest
  },
  infoNok: {
    ...info,
    background: colors.sandLighter
  },
  headerOk: {
    ...header,
    backgroundColor: colors.grassLighter
  },
  headerNok: {
    ...header,
    backgroundColor: colors.sandLight
  },
  body: {
    padding: 15
  },
  button: {
    width: '100%'
  }
}
