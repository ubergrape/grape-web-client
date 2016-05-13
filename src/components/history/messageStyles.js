const arrowWidth = 7
const marginRight = 5
const avatarWidth = 32

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
  avatar: {
    flexShrink: 0,
    marginRight
  },
  bubble: {
    flex: 1
  },
  avatarPlaceholder: {
    marginLeft: avatarWidth + arrowWidth
  },
  pending: {
    opacity: 0.5
  }
}
