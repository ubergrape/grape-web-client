export default {
  modal: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    zIndex: 1000,
    top: 0,
    display: 'flex',
    flexDirection: 'column'
  },
  backdrop: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 'auto',
    backgroundColor: '#000',
    opacity: 0.5
  },
  browser: {
    position: 'relative',
    width: '80%',
    top: '10%',
    alignSelf: 'center',
    maxWidth: 800,
    minWidth: 200
  }
}
