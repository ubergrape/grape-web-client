import random from 'lodash/number/random'

const dotAnimation = `dot-${random(1000000)}`

export default {
  notification: {
    '&:after': {
      content: '"…"',
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
