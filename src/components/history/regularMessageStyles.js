import {red} from 'grape-theme/dist/base-colors'
import createInlineIcon from '../inline-icon/create'

const arrowWidth = 7
const marginRight = 5
const avatarWidth = 32
const marginLeft = avatarWidth + marginRight + arrowWidth

export default {
  message: {
    display: 'inline-block',
    margin: '0 0 15px',
    position: 'relative'
  },
  body: {
    display: 'flex'
  },
  header: {
    marginLeft
  },
  avatar: {
    flexShrink: 0,
    marginRight
  },
  bubble: {
    flex: 1
  },
  avatarPlaceholder: {
    marginLeft: avatarWidth + marginRight
  },
  pending: {
    opacity: 0.5
  },
  unsent: {
    extend: createInlineIcon('warning', {color: red}),
    color: red,
    fontSize: '0.8em',
    marginTop: 10,
    marginLeft,
    '& a': {
      color: red
    }
  }
}
