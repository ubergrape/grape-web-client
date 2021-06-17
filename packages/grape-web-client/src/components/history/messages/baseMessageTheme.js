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
  contentWrapper: {
    width: '100%',
    minWidth: 0,
  },
  avatarColumn: {
    minWidth: 45,
  },
  bubble: {
    maxWidth: '100%',
  },
  content: contentStyles,
}
