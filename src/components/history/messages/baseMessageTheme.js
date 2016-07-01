import {styles as linkStyles} from '../../message-parts/linkTheme'

const arrowWidth = 7
const avatarMarginRight = 5
const avatarWidth = 32

export const leftOffset = avatarWidth + avatarMarginRight + arrowWidth
export const horizontalMargin = 20

export const styles = {
  message: {
    margin: `0 ${horizontalMargin}px`,
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
    marginRight: avatarMarginRight
  },
  avatarPlaceholder: {
    marginLeft: avatarWidth + avatarMarginRight
  },
  content: {
    '& a': linkStyles.link
  }
}
