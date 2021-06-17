import fonts from 'grape-theme/dist/fonts'

export default {
  container: {
    width: '100%',
    height: '100%',
    minHeight: 38,
  },
  highlighter: {
    extend: fonts.normal,
    minHeight: 38,
    boxSizing: 'border-box',
    padding: [14, 1],
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
  },
  editable: {
    composes: '$highlighter',
    outline: 'none',
    border: 'none',
    resize: 'none',
  },
  token: {
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
  },
  room: {
    background: 'linear-gradient(0deg, #e2c8f0, #e6d0f2)',
  },
  user: {
    background: 'linear-gradient(0deg, #75c7e5, #83d3f0)',
  },
  search: {
    background: 'linear-gradient(0deg, #b8e7aa, #c3ebb7)',
  },
  emoji: {
    background: 'linear-gradient(0deg, #fbd6d6, #fbdddd)',
  },
}
