import button from '../../button/default'
import {spacing} from '../sidebar-panel/theme'

export const styles = {
  sharedFiles: {
    padding: spacing
  },
  loadMoreContainer: {
    textAlign: 'center'
  },
  button,
  empty: {
    textAlign: 'center'
  },
  spinner: {
    position: 'static',
    marginTop: ({total}) => (total ? 0 : '50%')
  }
}
