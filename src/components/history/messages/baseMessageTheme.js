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
  header: {
    marginLeft: leftOffset
  },
  avatar: {
    verticalAlign: 'top',
    marginRight
  },
  avatarPlaceholder: {
    marginLeft: avatarWidth + marginRight
  }
}
