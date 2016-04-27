import {white} from 'grape-theme/dist/base-colors'

export default {
  history: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  probe: {
    extend: 'history',
    visibility: 'hidden',
    zIndex: -1
  },
  separatorDate: {
    background: white
  }
}
