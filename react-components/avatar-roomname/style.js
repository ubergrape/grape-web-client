const insideAvatar = {
  display: 'block',
  width: '100%',
  height: '100%'
}

export default {
  avatarRoomname: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    display: 'block',
    flexShrink: 0,
    overflow: 'hidden',
    borderRadius: '50%',
    fontWeight: 'normal'
  },
  abbr: {
    ...insideAvatar,
    textAlign: 'center',
    color: '#ffffff'
  },
  icon: {...insideAvatar},
  name: {
    paddingLeft: 10,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
}
