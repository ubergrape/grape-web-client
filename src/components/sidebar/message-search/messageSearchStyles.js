import color from 'color'
import {grayBlue, grayBlueLight, grayBlueLighter} from 'grape-theme/dist/base-colors'
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
  optionLabel: {
    extend: small,
    display: 'block',
    padding: [4, 10, 4, 20],
    background: grayBlueLight,
    cursor: 'pointer',
    '&:hover': {
      isolate: false,
      background: color(grayBlueLight).darken(0.05).hexString()
    }
  },
  optionCheckbox: {
    marginRight: 5,
    cursor: 'pointer'
  }
}
