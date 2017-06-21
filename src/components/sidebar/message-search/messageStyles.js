import {gainsboroLight, grayDark} from 'grape-theme/dist/base-colors'
import omit from 'lodash/object/omit'
import {icon as iconSize} from 'grape-theme/dist/sizes'

import {styles as linkStyles} from '../../message-parts/linkTheme'

const arrowWidth = 7
const marginRight = 10
const shadowColor = 'rgba(0,0,0,0.3)'
const transition = 'box-shadow 150ms ease-out'

const link = omit(linkStyles.link, '&:hover')
const linkHover = linkStyles.link['&:hover']

export default {
  message: {
    cursor: 'pointer',
    margin: [0, 0, 15]
  },
  body: {
    display: 'flex'
  },
  header: {
    paddingLeft: iconSize.l + marginRight + arrowWidth
  },
  leftColumn: {
    flexShrink: 0,
    marginRight
  },
  rightColumn: {
    flex: 1,
    width: '100%'
  },
  bubble: {
    '&:hover:before': {
      transition,
      boxShadow: `-3px 4px 8px ${shadowColor}`
    }
  },
  content: {
    transition,
    '&:hover': {
      isolate: false,
      boxShadow: `0px 1px 8px ${shadowColor}`
    },
    '& a': link,
    '& a:hover': linkHover,
    '& pre': {
      display: 'block',
      color: grayDark,
      border: `1px solid ${gainsboroLight}`
    }
  }
}
