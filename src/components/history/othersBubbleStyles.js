// FIXME use grape-theme
const color = '#edf0f5'

export default {
  bubble: {
    flex: 1,
    '&:before': {
      // FIXME solve specificity problem
      background: `${color} !important`
    }
  },
  content: {
      // FIXME solve specificity problem
    background: `${color} !important`
  }
}
