import { small } from 'grape-theme/dist/fonts'

export default {
  avatarName: {
    display: 'flex',
    alignItems: 'center',
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
