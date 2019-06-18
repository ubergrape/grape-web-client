import fonts from 'grape-theme/dist/fonts'
import { red } from 'grape-theme/dist/base-colors'

import { styles as baseStyles } from '../baseMessageTheme'
import createInlineIcon from '../../../inline-icon/create'

export const styles = {
  ...baseStyles,
  clickable: {
    cursor: 'pointer',
    '&:hover': {
      isolate: false,
      opacity: 0.8,
    },
  },
  authorClickable: {
    composes: '$clickable',
  },
  disabled: {
    opacity: 0.5,
  },
  unsentWarning: {
    extend: [createInlineIcon('warning', { color: red }), fonts.small],
    color: red,
    marginTop: 5,
    '& a': {
      isolate: false,
      color: red,
    },
  },
  action: {
    margin: '2px auto',
    display: 'flex',
    alignItems: 'center',
  },
  iconBorder: {
    width: 24,
    height: 24,
    borderRadius: 12,
    border: '1px solid #E0E0E0',
    background: '#FFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  callMissed: {
    width: 16,
    color: '#D4210A',
  },
  callOngoing: {
    width: 12,
    height: 12,
    color: '#6FA300',
  },
  actionText: {
    marginLeft: 5,
  },
}
