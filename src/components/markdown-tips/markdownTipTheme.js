import {gray, grayLighter} from 'grape-theme/dist/base-colors'
import {bigger, small} from 'grape-theme/dist/fonts'
// TODO #149 use generic styles instead of importing the following
import {baseMessageTheme as messageStyles} from '../history'

export const styles = {
  section: {
    marginTop: 20,
    paddingTop: 20,
    borderTop: `1px solid ${grayLighter}`,
    '&:first-child': {
      marginTop: 0
    }
  },
  title: {
    extend: [bigger],
    marginBottom: 5
  },
  subheading: {
    extend: [small],
    fontStyle: 'italic',
    margin: [20, 0, 5],
    textTransform: 'capitalize',
    color: gray
  },
  example: {
    extend: [messageStyles.content['& code']],
    width: 'auto',
    display: 'block',
    padding: 10,
    whiteSpace: 'pre-line',
    backgroundColor: grayLighter
  },
  renderedExample: {
    extend: [messageStyles.content],
    '& pre code': {
      width: 'auto'
    }
  }
}
