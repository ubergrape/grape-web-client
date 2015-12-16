import fonts from 'grape-theme/dist/fonts'

export default {
  ...fonts.normal,
  border: 'none',
  margin: 0,
  padding: 0,
  // XXX
  color: '#1e86f0 !important',
  '&:hover': {
    color: '#4098f2 !important',
    // !important can be removed when this is done:
    // https://github.com/jsstyles/jss/issues/119
    textDecoration: 'none !important'
  }
}
