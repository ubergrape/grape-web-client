import fonts from 'grape-theme/dist/fonts'

export default {
  ...fonts.normal,
  border: 'none',
  margin: 0,
  padding: 0,
  // XXX
  color: '#707782 !important',
  '&:hover': {
    color: '#318FEF !important',
    // !important can be removed when this is done:
    // https://github.com/jsstyles/jss/issues/119
    textDecoration: 'none !important'
  }
}
