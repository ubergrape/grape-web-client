import {grayLight} from 'grape-theme/dist/base-colors'

export const styles = {
  media: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  actionsContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  actions: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  embed: {
    maxWidth: '100%',
    maxHeight: '100%',
    '& iframe': {
      maxWidth: '100%',
      maxHeight: '100%'
    }
  }
}
