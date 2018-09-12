import contentStyles from '../../message-parts/contentStyles'

export const horizontalMargin = 20

export const styles = {
  message: {
    display: 'block',
    margin: [0, horizontalMargin],
    position: 'relative',
    minWidth: 200,
  },
  row: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  avatarColumn: {
    minWidth: 45,
  },
  bubble: {
    display: 'block',
    maxWidth: '100%',
  },
  content: contentStyles,
}
