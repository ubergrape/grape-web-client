import colors from 'grape-theme/dist/base-colors'
import fonts from 'grape-theme/dist/fonts'

const iconsWidth = 110

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
    minHeight: 38,
    paddingRight: iconsWidth
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
    // TODO think of a better approach.
    // Problem here is order of classes has less value than order of styles
    // Which means that we either need to produce ready style sheets or add
    // important tags.
    right: `${iconsWidth}px !important`,
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word'
  },
  room: {
    border: '1px solid #e2c8f0',
    background: 'linear-gradient(0deg, #e2c8f0, #e6d0f2)'
  },
  user: {
    border: '1px solid #75c7e5',
    background: 'linear-gradient(0deg, #75c7e5, #83d3f0)'
  },
  search: {
    border: '1px solid #b8e7aa',
    background: 'linear-gradient(0deg, #b8e7aa, #c3ebb7)'
  },
  emoji: {
    border: '1px solid #fbd6d6',
    background: 'linear-gradient(0deg, #fbd6d6, #fbdddd)'
  }
}
