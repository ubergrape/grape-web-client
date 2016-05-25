// FIXME use grape-theme
const color = '#edf0f5'

export const styles = {
  bubble: {
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
