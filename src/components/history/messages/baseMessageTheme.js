import {gainsboroLight, gainsboroDark, grayDark, white} from 'grape-theme/dist/base-colors'
import omit from 'lodash/object/omit'

import {styles as linkStyles} from '../../message-parts/linkTheme'

const link = omit(linkStyles.link, '&:hover')
const linkHover = linkStyles.link['&:hover']

export const horizontalMargin = 20

export const styles = {
  message: {
    margin: [0, horizontalMargin],
    position: 'relative',
    minWidth: 200
  },
  row: {
    display: 'flex',
    alignItems: 'flex-start'
  },
  avatarColumn: {
    minWidth: 45
  },
  bubble: {
    maxWidth: '100%'
  },
  // TODO #149 use standard typography styles
  content: {
    overflow: 'hidden',
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
      color: gainsboroDark
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
      overflow: 'auto',
      wordBreak: 'initial',
      transform: 'translateZ(0)',
      maxWidth: '100%'
    }
  }
}
