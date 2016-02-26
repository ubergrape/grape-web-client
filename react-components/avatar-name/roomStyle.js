import style from './style'

const insideAvatar = {
  display: 'block',
  width: '100%',
  height: '100%'
}

export default {
  ...style,
  abbr: {
    ...insideAvatar,
    textAlign: 'center',
    color: '#ffffff'
  },
  icon: {...insideAvatar}
}
