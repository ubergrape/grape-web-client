import theme from './theme'

const statusSize = 10
// Position status indicator in the middle of the icon circle of the right-bottom
// quarter.
const factor = (1 + Math.sin(Math.PI / 4)) / 2
const statusPositionCalc = `calc(100% * ${factor} - ${statusSize / 2}px)`

export default {
  ...theme,
  status: {
    position: 'absolute',
    left: statusPositionCalc,
    top: statusPositionCalc,
    width: 10,
    height: 10,
    border: [1, 'solid'],
    borderRadius: '50%',
  },
  online: {
    background: '#6cb500',
  },
  // currently "inCall" and "reachable" statuses using same color as offline/online and will be fixed in the new design
  inCall: {
    background: '#6cb500',
  },
  reachable: {
    background: '#098dec',
  },
  offline: {
    background: '#fc6e51',
  },
  image: {
    display: 'block',
    overflow: 'hidden',
    borderRadius: '50%',
  },
}
