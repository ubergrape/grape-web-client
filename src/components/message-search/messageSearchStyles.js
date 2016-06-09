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
  option: {
    background: colors.grayBlueLight,
    padding: '4px 10px 4px 20px'
  },
  optionLabel: {
    display: 'block',
    cursor: 'pointer'
  },
  optionCheckbox: {
    marginRight: 5,
    cursor: 'pointer'
  }
}
