import style from './style'

const insideAvatar = {
  display: 'block',
  borderRadius: '50%',
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
