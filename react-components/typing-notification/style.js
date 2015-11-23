import random from 'lodash/number/random'

const dotAnimation = `dot-${random(100000)}`

export default {
  notification: {
    '&:after': {
      content: '""',
      animation: `${dotAnimation} infinite 1s`
    }
  },
  [`@keyframes ${dotAnimation}`]: {
    '0%': {
      content: '""'
    },
    '25%': {
      content: '"."'
    },
    '50%': {
      content: '".."'
    },
    '75%': {
      content: '"..."'
    }
  }
}
