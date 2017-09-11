import {size as avatarSize} from '../../avatar'

export const styles = ({color}) => ({
  bubble: {
    '&:before': {
      background: `${color} !important`
    }
  },
  content: {
    minHeight: avatarSize,
    background: `${color} !important`
  }
})
