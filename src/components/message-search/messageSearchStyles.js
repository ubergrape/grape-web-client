import color from 'color'
import {grayBlueLighter} from 'grape-theme/dist/base-colors'
import button from '../button/default'
import colors from 'grape-theme/dist/base-colors'

export default {
  separatorDate: {
    background: grayBlueLighter
  },
  loadMoreContainer: {
    textAlign: 'center'
  },
  channel: {
    color: colors.grayBlue,
    textTransform: 'uppercase',
    marginTop: 20,
    marginBottom: 5,
    lineHeight: 1
  },
  message: {
    cursor: 'pointer'
  },
  empty: {
    textAlign: 'center'
  },
  highlighted: {
    background: colors.yellow
  },
  button,
  optionLabel: {
    display: 'block',
    padding: '4px 10px 4px 20px',
    background: colors.grayBlueLight,
    cursor: 'pointer',
    '&:hover': {
      background: color(colors.grayBlueLight).darken(0.05).hexString()
    }
  },
  optionCheckbox: {
    marginRight: 5,
    cursor: 'pointer'
  }
}
