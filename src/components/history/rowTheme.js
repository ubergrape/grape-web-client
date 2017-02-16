import {white} from 'grape-theme/dist/base-colors'

export const lastRowBottomSpace = 35
export const styles = {
  separator: {
    background: white
  },
  row: {
    paddingTop: 10
  },
  groupedRow: {
    paddingTop: 2
  },
  lastRow: {
    '&:after': {
      display: 'block',
      content: '""',
      height: lastRowBottomSpace
    }
  }
}
