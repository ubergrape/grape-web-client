import {gainsboroLight, gainsboroDark, grayDark, white} from 'grape-theme/dist/base-colors'
import omit from 'lodash/object/omit'

import {styles as linkStyles} from '../../message-parts/linkTheme'

const link = omit(linkStyles.link, '&:hover')
const linkHover = linkStyles['&:hover']

export const horizontalMargin = 20

export const styles = {
  message: {
    margin: `0 ${horizontalMargin}px`,
    position: 'relative',
    minWidth: 400
  },
  row: {
    display: 'flex'
  },
  avatarColumn: {
    verticalAlign: 'top',
    minWidth: 45
  },
  bubble: {
    maxWidth: '100%'
  },
  // TODO #149 use standard typogrphy styles
  content: {
    '& a': link,
    '& a:hover': linkHover,
    '& em': {
      fontStyle: 'italic'
    },
    '& blockquote': {
      borderLeft: `3px solid ${gainsboroLight}`,
      margin: '4px 0',
      padding: '0.5em 10px',
      fontStyle: 'italic',
      color: gainsboroDark
    },
    '& code': {
      display: 'inline-block',
      padding: '0 4px',
      wordWrap: 'normal',
      color: grayDark,
      border: `1px solid ${gainsboroLight}`,
      borderRadius: 4,
      background: white,
      wordBreak: 'break-all'
    },
    '& pre code': {
      overflow: 'auto',
      wordBreak: 'initial',
      transform: 'translateZ(0)',
      width: 500
    }
  }
}
