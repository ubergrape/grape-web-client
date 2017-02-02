import {normal} from 'grape-theme/dist/fonts'

export const styles = {
  main: {
    flex: 1,
    minWidth: 0
  },
  side: {
    marginLeft: 10
  },
  text: {
    extend: normal,
    lineHeight: 1.4
  },
  fields: {
    margin: [3, 0]
  },
  fieldGroup: {
    marginTop: 8,
    '&:first-child': {
      marginTop: 0
    }
  },
  fieldGroupShort: {
    display: 'flex'
  }
}
