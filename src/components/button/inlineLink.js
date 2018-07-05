import link from './link'

export default {
  ...link,
  display: 'inline',
  fontSize: 'inherit',
  '&:hover': {
    ...link['&:hover'],
    textDecoration: 'underline',
  },
}
