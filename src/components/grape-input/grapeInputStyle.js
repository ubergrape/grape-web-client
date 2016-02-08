const iconsWidth = 110

export default {
  container: {
    width: '100%',
    height: '100%',
    minHeight: 38,
    paddingRight: iconsWidth
  },
  editable: {
    minHeight: 38,
    boxSizing: 'border-box',
    padding: '14px 1px',
    textRendering: 'auto'
  },
  highlighter: {
    extend: 'editable',
    right: iconsWidth,
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
