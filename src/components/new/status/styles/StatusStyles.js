import theme from '../../../../constants/theme'

export default {
  circle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    right: 0,
    bottom: 0,
    position: 'absolute',
  },
  online: {
    extend: 'circle',
    backgroundColor: theme.colorOnline,
  },
  reachable: {
    extend: 'circle',
    backgroundColor: theme.colorReachable,
  },
  private: {
    extend: 'circle',
    width: 8,
  },
}
