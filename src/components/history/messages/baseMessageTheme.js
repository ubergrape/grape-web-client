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
    marginRight: avatarMarginRight,
    cursor: 'pointer'
  },
  avatarPlaceholder: {
    marginLeft: avatarWidth + avatarMarginRight
  },
  content: {
    '& a': linkStyles.link,
    '& code': {
      display: 'inline-block',
      maxWidth: '100%',
      padding: '0 4px',
      wordWrap: 'normal',
      // FIXME: replace with theme colors.
      color: '#4d4d4d',
      border: '1px solid #dad6e0',
      borderRadius: '4px',
      background: '#fff',
      wordBreak: 'break-all'
    },
    '& pre code': {
      overflow: 'auto',
      wordBreak: 'initial',
      transform: 'translateZ(0)'
    }
  }
}
