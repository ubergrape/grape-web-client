import { small } from 'grape-theme/dist/fonts'
import sizes from 'grape-theme/dist/sizes'

export default {
  avatarName: {
    display: 'flex',
    alignItems: 'center',
  },
  camera: {
    margin: '0 5px',
    flexShrink: 0,
    width: sizes.icon.m,
    height: sizes.icon.m,
    color: '#548EE5',
  },
  avatar: {
    display: 'block',
    position: 'relative',
    flexShrink: 0,
    fontWeight: 'normal',
    backgroundColor: '#fff',
  },
  name: {
    extend: small,
    paddingLeft: 10,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}
