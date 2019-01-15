import inlineLink from '../../button/inlineLink'

export default {
  link: {
    extends: inlineLink,
    wordBreak: 'break-word',
    '&:hover': {
      ...inlineLink['&:hover'],
      textDecoration: 'none',
      // Using border in order to underline the icon as well.
      borderBottom: [1, 'solid'],
    },
  },
  icon: {
    display: 'inline-block',
    background: 'no-repeat',
    backgroundSize: 'contain',
    width: '1em',
    height: '1em',
  },
}
