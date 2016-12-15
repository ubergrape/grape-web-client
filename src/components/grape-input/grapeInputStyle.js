import colors from 'grape-theme/dist/base-colors'
import fonts from 'grape-theme/dist/fonts'

const editableAndHighliter = {
  ...fonts.normal,
  minHeight: 38,
  boxSizing: 'border-box',
  padding: '14px 1px'
}

export default {
  container: {
    width: '100%',
    height: '100%',
    minHeight: 38
  },
  editable: {
    extend: editableAndHighliter,
    color: colors.black,
    outline: 'none',
    border: 'none',
    resize: 'none'
  },
  highlighter: {
    extend: editableAndHighliter,
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word'
  },
  room: {
    background: 'linear-gradient(0deg, #e2c8f0, #e6d0f2)'
  },
  user: {
    background: 'linear-gradient(0deg, #75c7e5, #83d3f0)'
  },
  search: {
    background: 'linear-gradient(0deg, #b8e7aa, #c3ebb7)'
  },
  emoji: {
    background: 'linear-gradient(0deg, #fbd6d6, #fbdddd)'
  }
}
