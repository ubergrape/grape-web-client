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
  leftColumn: {
    flexShrink: 0,
    marginRight
  },
  rightColumn: {
    flex: 1
  },
  avatarPlaceholder: {
    marginLeft: avatarWidth + arrowWidth
  }
}
