import { size as avatarSize } from '../../avatar'

export const styles = ({ backgroundColor, borderColor }) => ({
  bubble: {
    '&:before': {
      background: `${backgroundColor} !important`,
      border: borderColor ? `1px solid ${borderColor}` : '0',
    },
  },
  content: {
    minHeight: avatarSize,
    background: `${backgroundColor} !important`,
    border: borderColor ? `1px solid ${borderColor}` : '0',
  },
})
