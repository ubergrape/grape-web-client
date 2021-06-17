import button from '../../button/default'
import { spacing } from '../constants'

export const styles = {
  sharedFiles: {
    display: 'block',
  },
  loadMoreContainer: {
    display: 'block',
    textAlign: 'center',
    marginTop: spacing,
  },
  button,
  empty: {
    textAlign: 'center',
  },
  spinner: {
    position: 'static',
    marginTop: ({ total }) => (total ? 0 : '50%'),
  },
}
