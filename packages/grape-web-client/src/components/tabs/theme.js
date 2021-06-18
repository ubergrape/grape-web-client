import { grayBlueLighter } from 'grape-theme/dist/base-colors'

export const styles = {
  tabs: {
    alignItems: 'center',
    display: 'flex',
    backgroundColor: grayBlueLighter,
    listStyleType: 'none',
    padding: [0, 20],
  },
  item: {
    listStyleType: 'none',
    marginLeft: 20,
    '&:first-child': {
      isolate: false,
      marginLeft: 0,
    },
  },
}
