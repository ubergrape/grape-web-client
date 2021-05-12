import { white } from 'grape-theme/dist/base-colors'

export const lastRowBottomSpace = 35
export const styles = {
  separator: {
    background: white,
  },
  row: {
    display: 'block',
    paddingTop: 10,
  },
  groupedRow: {
    display: 'block',
    paddingTop: 2,
  },
  lastRow: {
    '&:after': {
      display: 'block',
      content: '""',
      height: lastRowBottomSpace,
    },
  },
}
