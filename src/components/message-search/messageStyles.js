import omit from 'lodash/object/omit'

import {styles as linkStyles} from '../message-parts/linkTheme'

const arrowWidth = 7
const marginRight = 10
const avatarWidth = 32
const shadowColor = 'rgba(0,0,0,0.3)'
const transition = 'box-shadow 150ms ease-out'

const link = omit(linkStyles.link, '&:hover')
const linkHover = linkStyles['&:hover']

export default {
  message: {
    margin: '0 0 15px'
  },
  body: {
    display: 'flex'
  },
  header: {
    paddingLeft: avatarWidth + marginRight + arrowWidth
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
      // FIXME: replace with theme colors.
      color: '#4d4d4d',
      border: '1px solid #dad6e0'
    }
  }
}
