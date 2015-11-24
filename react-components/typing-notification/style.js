import random from 'lodash/number/random'

const dotAnimation = `dot`

export default {
  notification: {
    '&:after': {
      // ascii code for the ellipsis character
      content: '"\\2026"',
      overflow: 'hidden',
      display: 'inline-block',
      verticalAlign: 'bottom',
      width: 0,
      animation: `${dotAnimation} steps(4, end) 1s infinite`
    }
  },
  [`@keyframes ${dotAnimation}`]: {
    to: {
      width: '1em'
    }
  }
}
