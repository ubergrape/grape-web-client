import createInlineIcon from '../../inline-icon/create'
import {gray} from 'grape-theme/dist/base-colors'

import {styles as baseStyles} from './baseMessageTheme'

export const styles = {
  ...baseStyles,
  container: {
    extend: createInlineIcon('iconLink', {
      color: gray,
      size: '0.8em'
    }),
    // FIXME replace with theme colors.
    backgroundColor: '#fbfbfb',
    border: `1px solid #e5e5e5`,
    borderRadius: 3,
    color: gray,
    textDecoration: 'none',
    padding: '2px 5px',
    '&:hover': {
      textDecoration: 'underline'
    },
    fontSize: '0.8em'
  },
  bubbleContent: {}
}
