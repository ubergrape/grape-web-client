export default {
  avatarUsername: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    display: 'block',
    flexShrink: 0,
    position: 'relative'
  },
  status: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 10,
    height: 10,
    border: '1px solid',
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
  },
  name: {
    paddingLeft: 10,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
}
