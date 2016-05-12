const arrowWidth = 7
const marginRight = 5
const avatarWidth = 32
const shadowColor = 'rgba(0,0,0,0.3)'

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
  bubble: {
    '&:hover:before': {
      boxShadow: `-3px 4px 8px ${shadowColor}`
    }
  },
  content: {
    '&:hover': {
      boxShadow: `0px 1px 8px ${shadowColor}`
    }
  }

}
