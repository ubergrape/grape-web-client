import style from './style'

const statusSize = 10
// Position status indicator in the middle of the icon circle of the right-bottom
// quarter.
const statusPositionCalc = `calc(100% / 1.175 - ${statusSize / 2}px)`

export default {
  ...style,
  status: {
    position: 'absolute',
    left: statusPositionCalc,
    top: statusPositionCalc,
    width: 10,
    height: 10,
    border: [1, 'solid'],
    borderRadius: '50%'
  },
  online: {
    background: '#6cb500'
  },
  offline: {
    background: '#fc6e51'
  },
  image: {
    display: 'block',
    overflow: 'hidden',
    borderRadius: '50%'
  }
}
