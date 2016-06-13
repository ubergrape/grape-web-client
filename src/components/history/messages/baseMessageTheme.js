import {styles as linkStyles} from '../../message-parts/linkTheme'

const arrowWidth = 7
const marginRight = 5
const avatarWidth = 32

export const leftOffset = avatarWidth + marginRight + arrowWidth

export const styles = {
  message: {
    margin: '0 20px',
    position: 'relative'
  },
  body: {
    display: 'flex'
  },
  header: {
    marginLeft: leftOffset
  },
  avatar: {
    verticalAlign: 'top',
    marginRight
  },
  avatarPlaceholder: {
    marginLeft: avatarWidth + marginRight
  },
  content: {
    '& a': linkStyles.link
  }
}
