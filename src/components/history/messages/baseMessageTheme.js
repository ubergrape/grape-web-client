import {styles as linkStyles} from '../../message-parts/linkTheme'

export const styles = {
  message: {
    margin: '0 20px',
    position: 'relative',
    minWidth: 400
  },
  row: {
    display: 'flex'
  },
  avatarColumn: {
    verticalAlign: 'top',
    minWidth: 45
  },
  bubble: {
    maxWidth: '100%'
  },
  content: {
    '& a': linkStyles.link,
    '& em': {
      fontStyle: 'italic'
    },
    '& blockquote': {
      // FIXME: replace with theme colors.
      borderLeft: '3px solid #dad6e0',
      margin: '4px 0',
      padding: '0.5em 10px',
      fontStyle: 'italic',
      color: '#888291'
    },
    '& code': {
      display: 'inline-block',
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
      transform: 'translateZ(0)',
      width: 500
    }
  }
}
