import {grayLight, orange, green} from 'grape-theme/dist/base-colors'

export const styles = {
  task: {
    position: 'relative'
  },
  taskButton: {},
  taskButtonIcon: {
    marginRight: 5,
    fill: grayLight
  },
  taskButtonText: {
    color: grayLight
  },
  taskButtonIconConnected: {
    fill: orange,
    marginRight: 3
  },
  taskButtonIconConnectedCheckmark: {
    fill: green,
    margin: {
      top: '-1em',
      left: '-0.4em'
    }
  }
}
