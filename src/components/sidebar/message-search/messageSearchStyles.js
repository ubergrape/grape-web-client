import { grayBlue, grayBlueLighter } from 'grape-theme/dist/base-colors'
import { small } from 'grape-theme/dist/fonts'

import button from '../../button/default'
import { spacing } from '../constants'

export default {
  messageSearch: {
    display: 'block',
    padding: spacing,
  },
  separatorDate: {
    background: grayBlueLighter,
  },
  loadMoreContainer: {
    display: 'block',
    textAlign: 'center',
    marginTop: spacing,
  },
  channel: {
    extend: small,
    color: grayBlue,
    textTransform: 'uppercase',
    marginTop: 20,
    marginBottom: 5,
    lineHeight: 1,
  },
  empty: {
    textAlign: 'center',
  },
  button,
  spinner: {
    position: 'static',
    marginTop: ({ total }) => (total ? 0 : '50%'),
  },
}
