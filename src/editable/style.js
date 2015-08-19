import colors from 'grape-theme/dist/base-colors'

export default {
  editable: {
    display: 'inline-block',
    width: '100%',
    height: '100%',
    lineHeight: 1.5,
    padding: 8,
    outline: 'none',
    '& p': {
      margin: 0
    }
  },
  placeholder: {
    '& p': {
      // Hide empty paragraphs when showing placeholder to avoid height jumps.
      fontSize: 0
    },
    '&:before': {
      content: 'attr(data-placeholder)',
      color: colors.gainsboroLight
    }
  }
}
