import omit from 'lodash/object/omit'
import {gainsboroLight, gainsboroDark, grayDark, white} from 'grape-theme/dist/base-colors'
import fonts from 'grape-theme/dist/fonts'

import {styles as linkStyles} from './linkTheme'

const link = omit(linkStyles.link, '&:hover')
const linkHover = linkStyles.link['&:hover']

// TODO #149 use standard typography styles
export default {
  overflow: 'hidden',
  display: 'block',
  '& p': {
    margin: 0
  },
  '& strong, & b': {
    fontWeight: 'bold'
  },
  '& a': link,
  '& a:hover': linkHover,
  '& em': {
    fontStyle: 'italic'
  },
  '& blockquote': {
    borderLeft: [3, 'solid', gainsboroLight],
    margin: [4, 0],
    padding: ['0.5em', 10],
    fontStyle: 'italic',
    '& p': {
      isolate: false,
      color: gainsboroDark
    }
  },
  '& pre': {
    margin: 0
  },
  '& code': {
    display: 'inline-block',
    padding: [0, 4],
    wordWrap: 'normal',
    color: grayDark,
    border: [1, 'solid', gainsboroLight],
    borderRadius: 4,
    background: white,
    wordBreak: 'break-all'
  },
  '& pre code': {
    isolate: false,
    overflow: 'auto',
    wordBreak: 'initial',
    transform: 'translateZ(0)',
    maxWidth: '100%'
  },
  // Increase specificity a bit to overtone the previous definitions,
  // saves us some writing.
  '&& *': {
    isolate: false,
    extend: fonts.normal
  }
}
