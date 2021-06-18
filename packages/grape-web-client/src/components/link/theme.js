import { blue, blueLight } from 'grape-theme/dist/base-colors'

export default {
  externalLink: {
    color: blue,
    cursor: 'pointer',
    display: 'inline',
    wordBreak: 'breakWord',
    textDecoration: 'none',
    '&:hover': {
      isolate: false,
      color: blueLight,
      textDecoration: 'underline',
    },
  },
}
