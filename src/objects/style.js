import colors from 'grape-theme/dist/base-colors'
import color from 'color'
import {jss} from '../jss'

export const INSERT_ANIMATION_DURATION = 200

// TODO migrate this legacy code to pure jss.

let rules = {
  '.ac': {
    userSelect: 'none'
  },
  '.ac.animate:after': {
    content: '""',
    position: 'absolute',
    height: '80%',
    width: 0,
    top: '9%',
    left: 0,
    pointerEvents: 'none',
    animation: `grape-object-insertion ${INSERT_ANIMATION_DURATION}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`
  },
  '@keyframes grape-object-insertion': {
     from: {
       background: colors.aquaDark,
       width: '100%'
     },
     to: {
       width: 0,
       background: color(colors.aquaDark).alpha(0.6).rgbaString()
     }
  }
}

export let sheet = jss.createStyleSheet(rules, {named: false})
