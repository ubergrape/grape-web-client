const arrowWidth = 7
const marginRight = 5
const avatarWidth = 32

export const leftOffset = avatarWidth + marginRight + arrowWidth

export const styles = {
  message: {
    display: 'inline-block',
    margin: '0 0 15px',
    position: 'relative'
  },
  body: {
    display: 'flex'
  },
  header: {
    marginLeft: leftOffset
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
  }
}
