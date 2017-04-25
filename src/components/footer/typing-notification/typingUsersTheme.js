import random from 'lodash/number/random'
import {small} from 'grape-theme/dist/fonts'
import {grayLight, white} from 'grape-theme/dist/base-colors'

const dotAnimation = `dot-${random(1000000)}`

const paddingBottom = 10

export const styles = {
  notification: {
    extend: small,
    position: 'absolute',
    top: -Math.round((small.fontSize * small.lineHeight) + paddingBottom),
    color: grayLight,
    padding: '0 20px',
    paddingBottom,
    background: white,
    width: '100%',
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
