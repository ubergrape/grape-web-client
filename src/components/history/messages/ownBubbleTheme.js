// FIXME use grape-theme
const color = '#d2e6fb'

export const styles = {
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
