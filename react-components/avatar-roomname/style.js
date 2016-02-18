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
    overflow: 'hidden',
    borderRadius: '50%'
  },
  abbr: {
    ...insideAvatar,
    textAlign: 'center',
    color: '#ffffff'
  },
  icon: {...insideAvatar},
  name: {
    paddingLeft: 10
  }
}
