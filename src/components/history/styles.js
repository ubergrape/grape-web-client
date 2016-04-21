import {white} from 'grape-theme/dist/base-colors'

export default {
  grid: {
    position: 'relative',
    // Without this property, Chrome repaints the entire Grid any time a new row or column is added.
    // Firefox only repaints the new row or column (regardless of this property).
    // Safari and IE don't support the property at all.
    willChange: 'transform',
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    '& .Grid__innerScrollContainer': {
      boxSizing: 'border-box',
      overflow: 'hidden'
    },
    '& .Grid__cell': {
      position: 'absolute'
    }
  },
  separatorDate: {
    background: white
  }
}
