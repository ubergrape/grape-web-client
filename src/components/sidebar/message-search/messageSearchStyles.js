import {grayBlue, grayBlueLighter} from 'grape-theme/dist/base-colors'
import {small} from 'grape-theme/dist/fonts'

import button from '../../button/default'
import {spacing} from '../sidebar-panel/theme'

export default {
  messageSearch: {
    padding: spacing
  },
  separatorDate: {
    background: grayBlueLighter
  },
  loadMoreContainer: {
    textAlign: 'center'
  },
  channel: {
    extend: small,
    color: grayBlue,
    textTransform: 'uppercase',
    marginTop: 20,
    marginBottom: 5,
    lineHeight: 1
  },
  empty: {
    textAlign: 'center'
  },
  button,
  spinner: {
    position: 'static',
    marginTop: ({total}) => (total ? 0 : '50%')
  }
}
